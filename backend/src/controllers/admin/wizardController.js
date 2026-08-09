import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';
import { isNotFoundError } from '../../utils/prismaErrors.js';
import {
  createUploader,
  removeStoredFile,
  toPublicUploadUrl,
  wizardUploadDir,
} from '../../utils/upload.js';
import {
  validateWizardCreate,
  validateWizardIdParam,
  validateWizardReorder,
  validateWizardUpdate,
} from '../../validators/wizard.js';

const upload = createUploader(wizardUploadDir, {
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxFileSize: 20 * 1024 * 1024,
});

export const uploadSingle = upload.single('image');

function toResponse(item) {
  return {
    ...item,
    imageUrl: toPublicUploadUrl('wizard', item.filename),
  };
}

export async function list(req, res, next) {
  try {
    const items = await prisma.wizardImage.findMany({
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

    const payload = validateWizardCreate(req.body ?? {});
    const aggregate = await prisma.wizardImage.aggregate({ _max: { sortOrder: true } });
    const nextSortOrder = (aggregate._max.sortOrder ?? 0) + 1;

    const item = await prisma.wizardImage.create({
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
    const { id } = validateWizardIdParam(req.params);
    const payload = validateWizardUpdate(req.body ?? {});
    const current = await prisma.wizardImage.findUnique({ where: { id } });

    if (!current) {
      throw createError(404, 'Wizard gambar tidak ditemukan.');
    }

    const data = {
      title: payload.title,
      description: payload.description,
    };

    if (req.file) {
      data.filename = req.file.filename;
    }

    const item = await prisma.wizardImage.update({
      where: { id },
      data,
    });

    if (req.file) {
      await removeStoredFile(wizardUploadDir, current.filename);
    }

    res.json(toResponse(item));
  } catch (error) {
    next(error);
  }
}

export async function reorder(req, res, next) {
  try {
    const { id, direction } = validateWizardReorder(req.body ?? {});
    const current = await prisma.wizardImage.findUnique({
      where: { id },
      select: { id: true, sortOrder: true },
    });

    if (!current) {
      throw createError(404, 'Wizard gambar tidak ditemukan.');
    }

    const neighbor = await prisma.wizardImage.findFirst({
      where:
        direction === 'up'
          ? { sortOrder: { lt: current.sortOrder } }
          : { sortOrder: { gt: current.sortOrder } },
      orderBy: { sortOrder: direction === 'up' ? 'desc' : 'asc' },
      select: { id: true, sortOrder: true },
    });

    if (!neighbor) {
      return res.json({ message: 'Posisi wizard tidak berubah.' });
    }

    await prisma.$transaction([
      prisma.wizardImage.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
      prisma.wizardImage.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
    ]);

    const items = await prisma.wizardImage.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json(items.map(toResponse));
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = validateWizardIdParam(req.params);
    const current = await prisma.wizardImage.findUnique({ where: { id } });

    if (!current) {
      throw createError(404, 'Wizard gambar tidak ditemukan.');
    }

    await prisma.wizardImage.delete({ where: { id } });
    await removeStoredFile(wizardUploadDir, current.filename);
    res.status(204).send();
  } catch (error) {
    if (isNotFoundError(error)) {
      return next(createError(404, 'Wizard gambar tidak ditemukan.'));
    }
    next(error);
  }
}