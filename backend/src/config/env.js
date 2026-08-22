/**
 * Memuat variabel lingkungan (.env): PORT, JWT_SECRET, CORS_ORIGIN, dll.
 */

import 'dotenv/config';

const WEAK_SECRETS = ['dev-secret-change-me', 'ganti-dengan-string-panjang-random', ''];
const VALID_NODE_ENVS = ['development', 'production', 'test'];

const nodeEnv = process.env.NODE_ENV ?? 'development';
const jwtSecret = process.env.JWT_SECRET ?? '';

if (!VALID_NODE_ENVS.includes(nodeEnv)) {
  throw new Error(
    `NODE_ENV tidak valid: "${nodeEnv}". Gunakan development, production, atau test.`,
  );
}

if (!jwtSecret || WEAK_SECRETS.includes(jwtSecret)) {
  if (nodeEnv === 'production') {
    throw new Error('JWT_SECRET harus diisi dengan string random yang kuat di production.');
  }
  console.warn('⚠ JWT_SECRET belum diatur — gunakan string random yang kuat sebelum deploy.');
}

export const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  isDevelopment: nodeEnv === 'development',
  port: Number(process.env.PORT) || 3001,
  jwtSecret: jwtSecret || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
