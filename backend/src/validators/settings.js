/** Validasi Zod untuk pengaturan beranda. */

import { z } from 'zod';
import { createError } from '../middleware/errorHandler.js';

const settingsUpdateSchema = z.object({
  heroTitle: z.string().trim().min(1, 'heroTitle wajib diisi.'),
  heroDescription: z.string().trim().min(1, 'heroDescription wajib diisi.'),
  contactEmail: z.string().trim().email('Email dukungan tidak valid.'),
});

const calculatorUrlSchema = z.object({
  calculatorUrl: z
    .string()
    .trim()
    .url('calculatorUrl harus berupa URL yang valid.')
    .or(z.literal('')),
});

function parseOrThrow(schema, payload) {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw createError(422, parsed.error.issues[0]?.message ?? 'Data tidak valid.');
  }
  return parsed.data;
}

export function validateSettingsUpdate(body) {
  return parseOrThrow(settingsUpdateSchema, body);
}

export function validateCalculatorUrlUpdate(body) {
  return parseOrThrow(calculatorUrlSchema, body);
}
