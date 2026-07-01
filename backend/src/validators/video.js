/** Validasi Zod untuk create/update video (+ URL YouTube valid). */

import { z } from 'zod';
import { createError } from '../middleware/errorHandler.js';
import { normalizeRichTextDescription } from '../utils/richText.js';

const videoBodySchema = z.object({
  sectionId: z.coerce.number().int().positive('sectionId tidak valid.'),
  title: z.string().trim().min(1, 'Judul video wajib diisi.'),
  youtubeUrl: z.string().trim().url('youtubeUrl harus berupa URL valid.'),
  description: z.string().default('').transform(normalizeRichTextDescription),
});

const videoIdParamSchema = z.object({
  id: z.coerce.number().int().positive('ID video tidak valid.'),
});

const videoReorderSchema = z.object({
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

export function validateVideoCreate(body) {
  return parseOrThrow(videoBodySchema, body);
}

export function validateVideoUpdate(body) {
  return parseOrThrow(videoBodySchema, body);
}

export function validateVideoIdParam(params) {
  return parseOrThrow(videoIdParamSchema, params);
}

export function validateVideoReorder(body) {
  return parseOrThrow(videoReorderSchema, body);
}
