/**
 * API publik: detail satu video + info materi induk.
 */

import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';
import { extractYouTubeId } from '../../utils/youtube.js';

function parseId(value) {
  const id = Number.parseInt(value, 10);
  if (Number.isNaN(id) || id <= 0) {
    throw createError(400, 'ID tidak valid.');
  }
  return id;
}

export async function getById(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        section: {
          select: { id: true, name: true },
        },
      },
    });

    if (!video) {
      throw createError(404, 'Video tidak ditemukan.');
    }

    res.json({
      ...video,
      youtube_id: extractYouTubeId(video.youtubeUrl),
    });
  } catch (err) {
    next(err);
  }
}
