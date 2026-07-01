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
    const sections = await prisma.section.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { videos: true },
        },
        quiz: {
          select: {
            id: true,
            _count: { select: { questions: true } },
          },
        },
      },
    });

    const totalVideos = sections.reduce((acc, section) => acc + section._count.videos, 0);

    res.json({
      sections: sections.map(({ quiz, ...section }) => ({
        ...section,
        has_quiz: Boolean(quiz),
        question_count: quiz?._count.questions ?? 0,
      })),
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
        quiz: {
          select: {
            id: true,
            _count: { select: { questions: true } },
          },
        },
      },
    });

    if (!section) {
      throw createError(404, 'Section tidak ditemukan.');
    }

    const { quiz, ...sectionData } = section;

    res.json({
      ...sectionData,
      has_quiz: Boolean(quiz),
      question_count: quiz?._count.questions ?? 0,
    });
  } catch (err) {
    next(err);
  }
}
