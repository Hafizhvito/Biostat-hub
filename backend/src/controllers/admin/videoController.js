/**
 * Admin CRUD video YouTube per materi + urutan naik/turun dalam materi.
 */

import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';
import { extractYouTubeId } from '../../utils/youtube.js';
import {
  validateVideoCreate,
  validateVideoIdParam,
  validateVideoReorder,
  validateVideoUpdate,
} from '../../validators/video.js';

function isNotFoundError(err) {
  return err?.code === 'P2025';
}

async function ensureSectionExists(sectionId) {
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    select: { id: true },
  });
  if (!section) {
    throw createError(404, 'Section tidak ditemukan.');
  }
}

function ensureValidYouTubeUrl(youtubeUrl) {
  const youtubeId = extractYouTubeId(youtubeUrl);
  if (!youtubeId) {
    throw createError(422, 'URL YouTube tidak valid.');
  }
  return youtubeId;
}

export async function list(req, res, next) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: [{ sectionId: 'asc' }, { sortOrder: 'asc' }],
      include: {
        section: {
          select: { id: true, name: true },
        },
      },
    });

    res.json(videos);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const payload = validateVideoCreate(req.body ?? {});
    ensureValidYouTubeUrl(payload.youtubeUrl);
    await ensureSectionExists(payload.sectionId);

    const aggregate = await prisma.video.aggregate({
      where: { sectionId: payload.sectionId },
      _max: { sortOrder: true },
    });
    const nextSortOrder = (aggregate._max.sortOrder ?? 0) + 1;

    const video = await prisma.video.create({
      data: {
        sectionId: payload.sectionId,
        title: payload.title,
        youtubeUrl: payload.youtubeUrl,
        description: payload.description,
        sortOrder: nextSortOrder,
      },
      include: {
        section: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json(video);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = validateVideoIdParam(req.params);
    const payload = validateVideoUpdate(req.body ?? {});
    ensureValidYouTubeUrl(payload.youtubeUrl);
    await ensureSectionExists(payload.sectionId);

    const existing = await prisma.video.findUnique({
      where: { id },
      select: { id: true, sectionId: true, sortOrder: true },
    });
    if (!existing) {
      throw createError(404, 'Video tidak ditemukan.');
    }

    let nextSortOrder = existing.sortOrder;
    if (existing.sectionId !== payload.sectionId) {
      const aggregate = await prisma.video.aggregate({
        where: { sectionId: payload.sectionId },
        _max: { sortOrder: true },
      });
      nextSortOrder = (aggregate._max.sortOrder ?? 0) + 1;
    }

    const video = await prisma.video.update({
      where: { id },
      data: {
        sectionId: payload.sectionId,
        title: payload.title,
        youtubeUrl: payload.youtubeUrl,
        description: payload.description,
        sortOrder: nextSortOrder,
      },
      include: {
        section: {
          select: { id: true, name: true },
        },
      },
    });

    res.json(video);
  } catch (err) {
    if (isNotFoundError(err)) {
      return next(createError(404, 'Video tidak ditemukan.'));
    }
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = validateVideoIdParam(req.params);

    await prisma.video.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    if (isNotFoundError(err)) {
      return next(createError(404, 'Video tidak ditemukan.'));
    }
    next(err);
  }
}

export async function reorder(req, res, next) {
  try {
    const { id } = validateVideoIdParam(req.params);
    const { direction } = validateVideoReorder(req.body ?? {});

    const current = await prisma.video.findUnique({
      where: { id },
      select: { id: true, sectionId: true, sortOrder: true },
    });
    if (!current) {
      throw createError(404, 'Video tidak ditemukan.');
    }

    const neighbor = await prisma.video.findFirst({
      where:
        direction === 'up'
          ? { sectionId: current.sectionId, sortOrder: { lt: current.sortOrder } }
          : { sectionId: current.sectionId, sortOrder: { gt: current.sortOrder } },
      orderBy: { sortOrder: direction === 'up' ? 'desc' : 'asc' },
      select: { id: true, sortOrder: true },
    });

    if (!neighbor) {
      return res.json({ message: 'Posisi video tidak berubah.' });
    }

    await prisma.$transaction([
      prisma.video.update({
        where: { id: current.id },
        data: { sortOrder: neighbor.sortOrder },
      }),
      prisma.video.update({
        where: { id: neighbor.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);

    const videos = await prisma.video.findMany({
      where: { sectionId: current.sectionId },
      orderBy: { sortOrder: 'asc' },
      include: {
        section: {
          select: { id: true, name: true },
        },
      },
    });

    res.json(videos);
  } catch (err) {
    next(err);
  }
}
