import { z } from 'zod';
import { createError } from '../middleware/errorHandler.js';

const downloadMetaSchema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi.'),
  description: z.string().default('').transform((value) => value.trim()),
  category: z.enum(['Materi', 'Template', 'Panduan SPSS', 'Lainnya']),
});

const downloadIdSchema = z.object({
  id: z.coerce.number().int().positive('ID unduhan tidak valid.'),
});

function parseOrThrow(schema, payload) {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw createError(422, parsed.error.issues[0]?.message ?? 'Data tidak valid.');
  }
  return parsed.data;
}

export function validateDownloadMeta(body) {
  return parseOrThrow(downloadMetaSchema, body);
}

export function validateDownloadIdParam(params) {
  return parseOrThrow(downloadIdSchema, params);
}