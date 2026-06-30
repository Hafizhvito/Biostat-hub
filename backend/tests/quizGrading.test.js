import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gradeQuiz } from '../src/services/quizGrading.js';

test('gradeQuiz returns score and per-question results', () => {
  const questions = [
    { id: 1, options: [{ id: 10, isCorrect: true }, { id: 11, isCorrect: false }] },
    { id: 2, options: [{ id: 20, isCorrect: false }, { id: 21, isCorrect: true }] },
  ];
  const answers = [
    { question_id: 1, option_id: 10 },
    { question_id: 2, option_id: 20 },
  ];
  const result = gradeQuiz(questions, answers);
  assert.equal(result.score, 1);
  assert.equal(result.total, 2);
  assert.equal(result.results[0].is_correct, true);
  assert.equal(result.results[1].is_correct, false);
});

test('gradeQuiz rejects unanswered questions', () => {
  const questions = [{ id: 1, options: [{ id: 10, isCorrect: true }] }];
  const answers = [];
  assert.throws(() => gradeQuiz(questions, answers), /semua soal/i);
});
