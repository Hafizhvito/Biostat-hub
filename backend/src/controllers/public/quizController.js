/**
 * API publik: ambil soal kuis (tanpa jawaban benar) & submit jawaban untuk grading.
 */

import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';
import { gradeQuiz } from '../../services/quizGrading.js';

function parseId(value) {
  const id = Number.parseInt(value, 10);
  if (Number.isNaN(id) || id <= 0) {
    throw createError(400, 'ID video tidak valid.');
  }
  return id;
}

function validateAnswers(answers) {
  if (!Array.isArray(answers)) {
    throw createError(422, 'answers harus berupa array.');
  }

  if (answers.length === 0) {
    throw createError(422, 'answers tidak boleh kosong.');
  }

  const normalized = answers.map((answer, index) => {
    const questionId = Number.parseInt(answer?.question_id, 10);
    const optionId = Number.parseInt(answer?.option_id, 10);

    if (Number.isNaN(questionId) || Number.isNaN(optionId)) {
      throw createError(422, `Format jawaban tidak valid pada index ${index}.`);
    }

    return {
      question_id: questionId,
      option_id: optionId,
    };
  });

  return normalized;
}

export async function getByVideoId(req, res, next) {
  try {
    const videoId = parseId(req.params.id);
    const quiz = await prisma.quiz.findUnique({
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

    if (!quiz) {
      throw createError(404, 'Quiz tidak ditemukan.');
    }

    const sanitizedQuestions = quiz.questions.map((question) => ({
      id: question.id,
      questionText: question.questionText,
      imageUrl: question.imageUrl || null,
      sortOrder: question.sortOrder,
      options: question.options.map(({ isCorrect, ...option }) => option),
    }));

    res.json({
      ...quiz,
      questions: sanitizedQuestions,
    });
  } catch (err) {
    next(err);
  }
}

export async function submit(req, res, next) {
  try {
    const videoId = parseId(req.params.id);
    const answers = validateAnswers(req.body?.answers);

    const quiz = await prisma.quiz.findUnique({
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

    if (!quiz) {
      throw createError(404, 'Quiz tidak ditemukan.');
    }

    const result = gradeQuiz(quiz.questions, answers);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
