/**
 * Memuat variabel lingkungan (.env): PORT, JWT_SECRET, CORS_ORIGIN, dll.
 */

import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};