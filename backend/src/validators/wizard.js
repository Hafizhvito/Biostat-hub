import { z } from 'zod';
import { createError } from '../middleware/errorHandler.js';

const wizardSchema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi.'),
  description: z.string().default('').transform((value) => value.trim()),
});

const wizardIdSchema = z.object({
  id: z.coerce.number().int().positive('ID wizard tidak valid.'),
});

const wizardReorderSchema = z.object({
  id: z.coerce.number().int().positive('ID wizard tidak valid.'),
  direction: z.enum(['up', 'down']),
});

function parseOrThrow(schema, payload) {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw createError(422, parsed.error.issues[0]?.message ?? 'Data tidak valid.');
  }
  return parsed.data;
}

export function validateWizardCreate(body) {
  return parseOrThrow(wizardSchema, body);
}

export function validateWizardUpdate(body) {
  return parseOrThrow(wizardSchema, body);
}

export function validateWizardIdParam(params) {
  return parseOrThrow(wizardIdSchema, params);
}

export function validateWizardReorder(body) {
  return parseOrThrow(wizardReorderSchema, body);
}