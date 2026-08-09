/**
 * API publik: daftar materi & detail materi beserta videonya.
 */

import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';

function parseId(value) {
  const id = Number.parseInt(value, 10);
  if (Number.isNaN(id) || id <= 0) {
    throw createError(400, 'ID tidak valid.');
  }
  return id;
}

export async function list(req, res, next) {
  try {
    const level = String(req.query.level || '').trim();
    const sections = await prisma.section.findMany({
      where: level && level !== 'all' ? { level } : undefined,
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { videos: true },
        },
      },
    });

    const totalVideos = sections.reduce((acc, section) => acc + section._count.videos, 0);

    res.json({
      sections,
      stats: {
        total_sections: sections.length,
        total_videos: totalVideos,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const section = await prisma.section.findUnique({
      where: { id },
      include: {
        videos: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!section) {
      throw createError(404, 'Section tidak ditemukan.');
    }

    res.json(section);
  } catch (err) {
    next(err);
  }
}
