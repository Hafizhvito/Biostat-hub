/**
 * Memuat variabel lingkungan (.env): PORT, JWT_SECRET, CORS_ORIGIN, dll.
 */

import 'dotenv/config';

const WEAK_SECRETS = ['dev-secret-change-me', 'ganti-dengan-string-panjang-random', ''];

const jwtSecret = process.env.JWT_SECRET ?? '';

if (!jwtSecret || WEAK_SECRETS.includes(jwtSecret)) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET harus diisi dengan string random yang kuat di production.');
  }
  console.warn('⚠ JWT_SECRET belum diatur — gunakan string random yang kuat sebelum deploy.');
}

export const env = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: jwtSecret || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};