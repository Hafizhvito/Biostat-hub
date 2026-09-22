import { z } from 'zod';
import { createError } from '../middleware/errorHandler.js';

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const calculatorLinkSchema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi.'),
  url: z
    .string()
    .trim()
    .url('URL harus valid.')
    .refine(isHttpUrl, 'URL harus menggunakan http:// atau https://.'),
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
