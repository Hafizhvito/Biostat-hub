import { z } from 'zod';
import { createError } from '../middleware/errorHandler.js';

const calculatorLinkSchema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi.'),
  url: z.string().trim().url('URL harus valid.'),
});

const calculatorLinkIdSchema = z.object({
  id: z.coerce.number().int().positive('ID kalkulator tidak valid.'),
});

function parseOrThrow(schema, payload) {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw createError(422, parsed.error.issues[0]?.message ?? 'Data tidak valid.');
  }
  return parsed.data;
}

export function validateCalculatorLinkCreate(body) {
  return parseOrThrow(calculatorLinkSchema, body);
}

export function validateCalculatorLinkUpdate(body) {
  return parseOrThrow(calculatorLinkSchema, body);
}

export function validateCalculatorLinkIdParam(params) {
  return parseOrThrow(calculatorLinkIdSchema, params);
}
