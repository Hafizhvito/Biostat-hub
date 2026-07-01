/**
 * API publik: ambil soal kuis (tanpa jawaban benar) & submit jawaban untuk grading.
 */

import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';
import { gradeQuiz } from '../../services/quizGrading.js';

function parseId(value) {
  const id = Number.parseInt(value, 10);
  if (Number.isNaN(id) || id <= 0) {
    throw createError(400, 'ID materi tidak valid.');
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

async function getQuizWithQuestions(sectionId) {
  return prisma.quiz.findUnique({
    where: { sectionId },
    include: {
      section: {
        select: { id: true, name: true },
      },
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

function sanitizeQuiz(quiz) {
  const sanitizedQuestions = quiz.questions.map((question) => ({
    id: question.id,
    questionText: question.questionText,
    imageUrl: question.imageUrl || null,
    sortOrder: question.sortOrder,
    options: question.options.map(({ isCorrect, ...option }) => option),
  }));

  return {
    id: quiz.id,
    sectionId: quiz.sectionId,
    section: quiz.section,
    questions: sanitizedQuestions,
  };
}

export async function list(req, res, next) {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        section: {
          select: { id: true, name: true, description: true, sortOrder: true },
        },
        _count: {
          select: { questions: true },
        },
      },
    });

    quizzes.sort((a, b) => a.section.sortOrder - b.section.sortOrder);

    res.json(
      quizzes.map((quiz) => ({
        id: quiz.id,
        section_id: quiz.sectionId,
        section_name: quiz.section.name,
        section_description: quiz.section.description,
        question_count: quiz._count.questions,
      }))
    );
  } catch (err) {
    next(err);
  }
}

export async function getBySectionId(req, res, next) {
  try {
    const sectionId = parseId(req.params.id);
    const quiz = await getQuizWithQuestions(sectionId);

    if (!quiz) {
      throw createError(404, 'Quiz tidak ditemukan.');
    }

    res.json(sanitizeQuiz(quiz));
  } catch (err) {
    next(err);
  }
}

export async function submit(req, res, next) {
  try {
    const sectionId = parseId(req.params.id);
    const answers = validateAnswers(req.body?.answers);

    const quiz = await getQuizWithQuestions(sectionId);

    if (!quiz) {
      throw createError(404, 'Quiz tidak ditemukan.');
    }

    const result = gradeQuiz(quiz.questions, answers);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
