import { z } from 'zod';
import { createError } from '../middleware/errorHandler.js';

const glossarySchema = z.object({
  term: z.string().trim().min(1, 'Istilah wajib diisi.'),
  definition: z.string().trim().min(1, 'Definisi wajib diisi.'),
  example: z.string().trim().optional().transform((value) => value || null),
});

const glossaryIdSchema = z.object({
  id: z.coerce.number().int().positive('ID glosarium tidak valid.'),
});

function parseOrThrow(schema, payload) {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw createError(422, parsed.error.issues[0]?.message ?? 'Data tidak valid.');
  }
  return parsed.data;
}

export function validateGlossaryCreate(body) {
  return parseOrThrow(glossarySchema, body);
}

export function validateGlossaryUpdate(body) {
  return parseOrThrow(glossarySchema, body);
}

export function validateGlossaryIdParam(params) {
  return parseOrThrow(glossaryIdSchema, params);
}