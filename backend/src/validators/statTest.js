import { z } from 'zod';
import { createError } from '../middleware/errorHandler.js';

const statTestSchema = z.object({
  name: z.string().trim().min(1, 'Nama uji wajib diisi.'),
  function: z.string().trim().min(1, 'Fungsi wajib diisi.'),
  dataType: z.enum(['nominal', 'ordinal', 'interval', 'rasio']),
  dataDistribution: z.enum(['parametrik', 'non-parametrik']),
  useCase: z.string().trim().min(1, 'Kapan digunakan wajib diisi.'),
  spssMenu: z.string().trim().min(1, 'Menu SPSS wajib diisi.'),
  notes: z.string().default('').transform((value) => value.trim()),
});

const statTestIdSchema = z.object({
  id: z.coerce.number().int().positive('ID uji tidak valid.'),
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