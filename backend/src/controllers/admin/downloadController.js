import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';
import { isNotFoundError } from '../../utils/prismaErrors.js';
import {
  downloadUploadDir,
  removeStoredFile,
  createUploader,
} from '../../utils/upload.js';
import { validateDownloadIdParam, validateDownloadMeta } from '../../validators/download.js';

const upload = createUploader(downloadUploadDir, {
  maxFileSize: 100 * 1024 * 1024,
  allowedExtensions: [
    '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.csv', '.txt',
    '.jpg', '.jpeg', '.png', '.webp', '.gif', '.zip',
  ],
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/zip',
    'application/x-zip-compressed',
  ],
});

export const uploadSingle = upload.single('file');

function toResponse(download) {
  const { filename, ...response } = download;
  return response;
}

export async function list(req, res, next) {
  try {
    const scope = String(req.query.scope || '').trim();
    const where = scope === 'material'
      ? { sectionId: { not: null } }
      : scope === 'general'
        ? { sectionId: null }
        : {};
    const downloads = await prisma.download.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: { section: { select: { id: true, name: true } } },
    });

    res.json(downloads.map(toResponse));
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  let savedToDatabase = false;

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
        sectionId: payload.sectionId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileSize,
      },
    });
    savedToDatabase = true;

    res.status(201).json(toResponse(download));
  } catch (error) {
    if (req.file && !savedToDatabase) {
      await removeStoredFile(downloadUploadDir, req.file.filename).catch((cleanupError) => {
        console.error('Gagal membersihkan file upload:', cleanupError);
      });
    }
    next(error);
  }
}

export async function update(req, res, next) {
  let savedToDatabase = false;

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
    savedToDatabase = true;

    if (req.file) {
      await removeStoredFile(downloadUploadDir, current.filename).catch((cleanupError) => {
        console.error('Gagal menghapus file lama:', cleanupError);
      });
    }

    res.json(toResponse(download));
  } catch (error) {
    if (req.file && !savedToDatabase) {
      await removeStoredFile(downloadUploadDir, req.file.filename).catch((cleanupError) => {
        console.error('Gagal membersihkan file pengganti:', cleanupError);
      });
    }
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
    await removeStoredFile(downloadUploadDir, download.filename).catch((cleanupError) => {
      console.error('Gagal menghapus file unduhan:', cleanupError);
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
