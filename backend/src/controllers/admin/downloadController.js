import path from 'path';
import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';
import { isNotFoundError } from '../../utils/prismaErrors.js';
import {
  downloadUploadDir,
  removeStoredFile,
  toPublicUploadUrl,
  createUploader,
} from '../../utils/upload.js';
import { validateDownloadIdParam, validateDownloadMeta } from '../../validators/download.js';

const upload = createUploader(downloadUploadDir, {
  maxFileSize: 100 * 1024 * 1024,
});

export const uploadSingle = upload.single('file');

function toResponse(download) {
  return {
    ...download,
    fileUrl: toPublicUploadUrl('downloads', download.filename),
  };
}

export async function list(req, res, next) {
  try {
    const downloads = await prisma.download.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });

    res.json(downloads.map(toResponse));
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    if (!req.file) {
      throw createError(422, 'File wajib diunggah.');
    }

    const payload = validateDownloadMeta(req.body ?? {});
    const fileSize = req.file.size;

    const download = await prisma.download.create({
      data: {
        title: payload.title,
        description: payload.description,
        category: payload.category,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileSize,
      },
    });

    res.status(201).json(toResponse(download));
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = validateDownloadIdParam(req.params);
    const payload = validateDownloadMeta(req.body ?? {});
    const current = await prisma.download.findUnique({ where: { id } });

    if (!current) {
      throw createError(404, 'File unduhan tidak ditemukan.');
    }

    const data = {
      ...payload,
    };

    if (req.file) {
      data.filename = req.file.filename;
      data.originalName = req.file.originalname;
      data.fileSize = req.file.size;
    }

    const download = await prisma.download.update({
      where: { id },
      data,
    });

    if (req.file) {
      await removeStoredFile(downloadUploadDir, current.filename);
    }

    res.json(toResponse(download));
  } catch (error) {
    if (isNotFoundError(error)) {
      return next(createError(404, 'File unduhan tidak ditemukan.'));
    }
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = validateDownloadIdParam(req.params);
    const download = await prisma.download.findUnique({ where: { id } });
    if (!download) {
      throw createError(404, 'File unduhan tidak ditemukan.');
    }

    await prisma.download.delete({ where: { id } });
    await removeStoredFile(downloadUploadDir, download.filename);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}