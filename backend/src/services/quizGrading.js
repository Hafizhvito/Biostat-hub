/**
 * Logika penilaian kuis: bandingkan jawaban user vs opsi benar di database.
 * Diuji di tests/quizGrading.test.js
 */

﻿import { createError } from '../middleware/errorHandler.js';

export function gradeQuiz(questions, answers) {
  if (answers.length !== questions.length) {
    throw createError(422, 'Mohon jawab semua soal sebelum mengirim.');
  }

  const answerMap = new Map(answers.map((a) => [a.question_id, a.option_id]));
  const results = questions.map((q) => {
    const selectedId = answerMap.get(q.id);
    const correctOption = q.options.find((o) => o.isCorrect);
    const isCorrect = selectedId === correctOption?.id;
    return {
      question_id: q.id,
      selected_option_id: selectedId,
      correct_option_id: correctOption?.id,
      is_correct: isCorrect,
    };
  });

  const score = results.filter((r) => r.is_correct).length;
  return { score, total: questions.length, results };
}
