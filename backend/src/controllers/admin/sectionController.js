/**
 * Admin CRUD materi (section) + urutan naik/turun.
 * Hapus ditolak jika materi masih berisi video.
 */

import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';
import { isNotFoundError } from '../../utils/prismaErrors.js';
import {
  validateSectionCreate,
  validateSectionIdParam,
  validateSectionReorder,
  validateSectionUpdate,
} from '../../validators/section.js';

export async function list(req, res, next) {
  try {
    const sections = await prisma.section.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { videos: true },
        },
      },
    });

    res.json(sections);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const payload = validateSectionCreate(req.body ?? {});
    const aggregate = await prisma.section.aggregate({
      _max: { sortOrder: true },
    });
    const nextSortOrder = (aggregate._max.sortOrder ?? 0) + 1;

    const section = await prisma.section.create({
      data: {
        name: payload.name,
        description: payload.description,
        sortOrder: nextSortOrder,
      },
    });

    res.status(201).json(section);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = validateSectionIdParam(req.params);
    const payload = validateSectionUpdate(req.body ?? {});

    const section = await prisma.section.update({
      where: { id },
      data: {
        name: payload.name,
        description: payload.description,
      },
    });

    res.json(section);
  } catch (err) {
    if (isNotFoundError(err)) {
      return next(createError(404, 'Section tidak ditemukan.'));
    }
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = validateSectionIdParam(req.params);
    const videoCount = await prisma.video.count({
      where: { sectionId: id },
    });

    if (videoCount > 0) {
      throw createError(409, `Section tidak bisa dihapus karena masih memiliki ${videoCount} video.`);
    }

    await prisma.section.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    if (isNotFoundError(err)) {
      return next(createError(404, 'Section tidak ditemukan.'));
    }
    next(err);
  }
}

export async function reorder(req, res, next) {
  try {
    const { id } = validateSectionIdParam(req.params);
    const { direction } = validateSectionReorder(req.body ?? {});

    const current = await prisma.section.findUnique({
      where: { id },
      select: { id: true, sortOrder: true },
    });
    if (!current) {
      throw createError(404, 'Section tidak ditemukan.');
    }

    const neighbor = await prisma.section.findFirst({
      where:
        direction === 'up'
          ? { sortOrder: { lt: current.sortOrder } }
          : { sortOrder: { gt: current.sortOrder } },
      orderBy: { sortOrder: direction === 'up' ? 'desc' : 'asc' },
      select: { id: true, sortOrder: true },
    });

    if (!neighbor) {
      return res.json({ message: 'Posisi section tidak berubah.' });
    }

    await prisma.$transaction([
      prisma.section.update({
        where: { id: current.id },
        data: { sortOrder: neighbor.sortOrder },
      }),
      prisma.section.update({
        where: { id: neighbor.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);

    const sections = await prisma.section.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    res.json(sections);
  } catch (err) {
    next(err);
  }
}
