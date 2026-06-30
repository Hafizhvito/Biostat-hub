/**
 * Admin: kelola kuis per video (simpan/hapus seluruh soal sekaligus).
 * Termasuk image_url opsional per soal (link gambar eksternal).
 */

import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';
import { validateQuizReplace, validateQuizVideoParam } from '../../validators/quiz.js';

function formatQuiz(quiz) {
  return {
    id: quiz.id,
    video_id: quiz.videoId,
    created_at: quiz.createdAt,
    updated_at: quiz.updatedAt,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      question_text: question.questionText,
      image_url: question.imageUrl || null,
      sort_order: question.sortOrder,
      options: question.options.map((option) => ({
        id: option.id,
        option_text: option.optionText,
        is_correct: option.isCorrect,
        sort_order: option.sortOrder,
      })),
    })),
  };
}

async function ensureVideoExists(videoId) {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    select: { id: true },
  });
  if (!video) {
    throw createError(404, 'Video tidak ditemukan.');
  }
}

async function getQuizWithQuestions(videoId) {
  return prisma.quiz.findUnique({
    where: { videoId },
    include: {
      questions: {
        orderBy: { sortOrder: 'asc' },
        include: {
          options: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  });
}

export async function getByVideoId(req, res, next) {
  try {
    const { videoId } = validateQuizVideoParam(req.params);
    const quiz = await getQuizWithQuestions(videoId);

    if (!quiz) {
      throw createError(404, 'Quiz tidak ditemukan.');
    }

    res.json(formatQuiz(quiz));
  } catch (err) {
    next(err);
  }
}

export async function replaceByVideoId(req, res, next) {
  try {
    const { videoId } = validateQuizVideoParam(req.params);
    const payload = validateQuizReplace(req.body ?? {});
    await ensureVideoExists(videoId);

    const quiz = await prisma.$transaction(async (tx) => {
      const existing = await tx.quiz.findUnique({
        where: { videoId },
        select: { id: true },
      });

      if (existing) {
        await tx.quiz.delete({
          where: { id: existing.id },
        });
      }

      return tx.quiz.create({
        data: {
          videoId,
          questions: {
            create: payload.questions.map((question, questionIndex) => ({
              questionText: question.questionText,
              imageUrl: question.imageUrl ?? '',
              sortOrder: questionIndex + 1,
              options: {
                create: question.options.map((option, optionIndex) => ({
                  optionText: option.optionText,
                  isCorrect: option.isCorrect,
                  sortOrder: optionIndex + 1,
                })),
              },
            })),
          },
        },
        include: {
          questions: {
            orderBy: { sortOrder: 'asc' },
            include: {
              options: {
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
        },
      });
    });

    res.json(formatQuiz(quiz));
  } catch (err) {
    next(err);
  }
}

export async function removeByVideoId(req, res, next) {
  try {
    const { videoId } = validateQuizVideoParam(req.params);

    const existing = await prisma.quiz.findUnique({
      where: { videoId },
      select: { id: true },
    });
    if (!existing) {
      throw createError(404, 'Quiz tidak ditemukan.');
    }

    await prisma.quiz.delete({
      where: { videoId },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
