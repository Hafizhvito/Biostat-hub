/**
 * Admin: kelola kuis mandiri (judul + soal, tanpa kaitan ke materi).
 */

import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';
import { validateQuizIdParam, validateQuizReplace } from '../../validators/quiz.js';

function formatQuiz(quiz) {
  return {
    id: quiz.id,
    title: quiz.title,
    sort_order: quiz.sortOrder,
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

async function getQuizWithQuestions(id) {
  return prisma.quiz.findUnique({
    where: { id },
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

async function createQuizWithQuestions(payload) {
  const maxSort = await prisma.quiz.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (maxSort._max.sortOrder ?? 0) + 1;

  return prisma.quiz.create({
    data: {
      title: payload.title,
      sortOrder,
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
}

export async function list(req, res, next) {
  try {
    const quizzes = await prisma.quiz.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    res.json(
      quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        question_count: quiz._count.questions,
      }))
    );
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const { id } = validateQuizIdParam(req.params);
    const quiz = await getQuizWithQuestions(id);

    if (!quiz) {
      throw createError(404, 'Quiz tidak ditemukan.');
    }

    res.json(formatQuiz(quiz));
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const payload = validateQuizReplace(req.body ?? {});
    const quiz = await createQuizWithQuestions(payload);
    res.status(201).json(formatQuiz(quiz));
  } catch (err) {
    next(err);
  }
}

export async function replaceById(req, res, next) {
  try {
    const { id } = validateQuizIdParam(req.params);
    const payload = validateQuizReplace(req.body ?? {});

    const quiz = await prisma.$transaction(async (tx) => {
      const existing = await tx.quiz.findUnique({
        where: { id },
        select: { id: true, sortOrder: true },
      });

      if (!existing) {
        throw createError(404, 'Quiz tidak ditemukan.');
      }

      const { sortOrder } = existing;

      await tx.quiz.delete({
        where: { id },
      });

      return tx.quiz.create({
        data: {
          id,
          title: payload.title,
          sortOrder,
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

export async function removeById(req, res, next) {
  try {
    const { id } = validateQuizIdParam(req.params);

    const existing = await prisma.quiz.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      throw createError(404, 'Quiz tidak ditemukan.');
    }

    await prisma.quiz.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
