import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';
import { isNotFoundError } from '../../utils/prismaErrors.js';
import {
  createUploader,
  removeStoredFile,
  statTestUploadDir,
  toPublicUploadUrl,
} from '../../utils/upload.js';
import {
  validateStatTestCreate,
  validateStatTestIdParam,
  validateStatTestReorder,
  validateStatTestUpdate,
} from '../../validators/statTest.js';

const upload = createUploader(statTestUploadDir, {
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxFileSize: 20 * 1024 * 1024,
});

export const uploadSingle = upload.single('image');

function toResponse(item) {
  return {
    ...item,
    imageUrl: toPublicUploadUrl('stat-tests', item.filename),
  };
}

export async function list(req, res, next) {
  try {
    const items = await prisma.statTest.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    res.json(items.map(toResponse));
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    if (!req.file) {
      throw createError(422, 'Gambar wajib diunggah.');
    }

    const payload = validateStatTestCreate(req.body ?? {});
    const aggregate = await prisma.statTest.aggregate({ _max: { sortOrder: true } });
    const nextSortOrder = (aggregate._max.sortOrder ?? 0) + 1;

    const item = await prisma.statTest.create({
      data: {
        title: payload.title,
        description: payload.description,
        filename: req.file.filename,
        sortOrder: nextSortOrder,
      },
    });

    res.status(201).json(toResponse(item));
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = validateStatTestIdParam(req.params);
    const payload = validateStatTestUpdate(req.body ?? {});
    const current = await prisma.statTest.findUnique({ where: { id } });

    if (!current) {
      throw createError(404, 'Ringkasan uji tidak ditemukan.');
    }

    const data = {
      title: payload.title,
      description: payload.description,
    };

    if (req.file) {
      data.filename = req.file.filename;
    }

    const item = await prisma.statTest.update({
      where: { id },
      data,
    });

    if (req.file) {
      await removeStoredFile(statTestUploadDir, current.filename);
    }

    res.json(toResponse(item));
  } catch (error) {
    next(error);
  }
}

export async function reorder(req, res, next) {
  try {
    const { id, direction } = validateStatTestReorder(req.body ?? {});
    const current = await prisma.statTest.findUnique({
      where: { id },
      select: { id: true, sortOrder: true },
    });

    if (!current) {
      throw createError(404, 'Ringkasan uji tidak ditemukan.');
    }

    const neighbor = await prisma.statTest.findFirst({
      where:
        direction === 'up'
          ? { sortOrder: { lt: current.sortOrder } }
          : { sortOrder: { gt: current.sortOrder } },
      orderBy: { sortOrder: direction === 'up' ? 'desc' : 'asc' },
      select: { id: true, sortOrder: true },
    });

    if (!neighbor) {
      return res.json({ message: 'Posisi ringkasan uji tidak berubah.' });
    }

    await prisma.$transaction([
      prisma.statTest.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
      prisma.statTest.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
    ]);

    const items = await prisma.statTest.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json(items.map(toResponse));
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = validateStatTestIdParam(req.params);
    const current = await prisma.statTest.findUnique({ where: { id } });

    if (!current) {
      throw createError(404, 'Ringkasan uji tidak ditemukan.');
    }

    await prisma.statTest.delete({ where: { id } });
    await removeStoredFile(statTestUploadDir, current.filename);
    res.status(204).send();
  } catch (error) {
    if (isNotFoundError(error)) {
      return next(createError(404, 'Ringkasan uji tidak ditemukan.'));
    }
    next(error);
  }
}
