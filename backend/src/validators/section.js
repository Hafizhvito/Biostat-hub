/** Validasi Zod untuk create/update materi. */

import { z } from 'zod';
import { createError } from '../middleware/errorHandler.js';
import { normalizeRichTextDescription } from '../utils/richText.js';

const sectionBodySchema = z.object({
  name: z.string().trim().min(1, 'Nama section wajib diisi.'),
  description: z.string().default('').transform(normalizeRichTextDescription),
  level: z.enum(['dasar', 'menengah', 'lanjut']).nullable().optional(),
});

const sectionIdParamSchema = z.object({
  id: z.coerce.number().int().positive('ID section tidak valid.'),
});

const sectionReorderSchema = z.object({
  direction: z.enum(['up', 'down'], {
    errorMap: () => ({ message: 'direction harus bernilai "up" atau "down".' }),
  }),
});

function parseOrThrow(schema, payload) {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw createError(422, parsed.error.issues[0]?.message ?? 'Data tidak valid.');
  }
  return parsed.data;
}

export function validateSectionCreate(body) {
  return parseOrThrow(sectionBodySchema, body);
}

export function validateSectionUpdate(body) {
  return parseOrThrow(sectionBodySchema, body);
}

export function validateSectionIdParam(params) {
  return parseOrThrow(sectionIdParamSchema, params);
}

export function validateSectionReorder(body) {
  return parseOrThrow(sectionReorderSchema, body);
}
