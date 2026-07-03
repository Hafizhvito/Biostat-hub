/** Validasi Zod untuk simpan kuis (judul, soal, opsi, tepat 1 jawaban benar). */

import { z } from 'zod';
import { createError } from '../middleware/errorHandler.js';

const quizIdParamSchema = z.object({
  id: z.coerce.number().int().positive('ID kuis tidak valid.'),
});

const quizOptionSchema = z.object({
  optionText: z.string().trim().min(1, 'Teks opsi wajib diisi.'),
  isCorrect: z.boolean(),
});

const quizQuestionSchema = z
  .object({
    questionText: z.string().trim().min(1, 'Teks pertanyaan wajib diisi.'),
    imageUrl: z
      .string()
      .trim()
      .optional()
      .transform((value) => value ?? '')
      .refine(
        (value) => value === '' || z.string().url().safeParse(value).success,
        'Link gambar tidak valid. Pastikan Anda menyalin link lengkap dari Google Drive atau sumber lain.'
      ),
    options: z.array(quizOptionSchema).min(2, 'Setiap pertanyaan minimal memiliki 2 opsi.'),
  })
  .superRefine((question, ctx) => {
    const totalCorrect = question.options.filter((option) => option.isCorrect).length;
    if (totalCorrect !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Setiap pertanyaan harus memiliki tepat 1 opsi benar (isCorrect=true).',
        path: ['options'],
      });
    }
  });

const quizReplaceSchema = z.object({
  title: z.string().trim().min(1, 'Judul kuis wajib diisi.').default('Kuis'),
  questions: z.array(quizQuestionSchema).min(1, 'questions minimal berisi 1 pertanyaan.'),
});

function parseOrThrow(schema, payload) {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw createError(422, parsed.error.issues[0]?.message ?? 'Data tidak valid.');
  }
  return parsed.data;
}

export function validateQuizIdParam(params) {
  return parseOrThrow(quizIdParamSchema, params);
}

export function validateQuizReplace(body) {
  return parseOrThrow(quizReplaceSchema, body);
}
