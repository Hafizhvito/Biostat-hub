import { z } from 'zod';
import { createError } from '../middleware/errorHandler.js';

const statTestSchema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi.'),
  description: z.string().default('').transform((value) => value.trim()),
});

const statTestIdSchema = z.object({
  id: z.coerce.number().int().positive('ID ringkasan uji tidak valid.'),
});

const statTestReorderSchema = z.object({
  id: z.coerce.number().int().positive('ID ringkasan uji tidak valid.'),
  direction: z.enum(['up', 'down']),
});

function parseOrThrow(schema, payload) {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw createError(422, parsed.error.issues[0]?.message ?? 'Data tidak valid.');
  }
  return parsed.data;
}

export function validateStatTestCreate(body) {
  return parseOrThrow(statTestSchema, body);
}

export function validateStatTestUpdate(body) {
  return parseOrThrow(statTestSchema, body);
}

export function validateStatTestIdParam(params) {
  return parseOrThrow(statTestIdSchema, params);
}

export function validateStatTestReorder(body) {
  return parseOrThrow(statTestReorderSchema, body);
}
