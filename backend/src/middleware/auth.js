/**
 * Middleware requireAdmin: validasi JWT Bearer pada route /api/admin/*.
 */

import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { createError } from './errorHandler.js';

export function requireAdmin(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw createError(401, 'Token autentikasi tidak ditemukan.');
    }

    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw createError(401, 'Format token tidak valid. Gunakan Bearer token.');
    }

    const payload = jwt.verify(token, env.jwtSecret);
    req.admin = {
      id: payload.sub,
      username: payload.username,
    };

    next();
  } catch (err) {
    if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
      return next(createError(401, 'Token tidak valid atau sudah kedaluwarsa.'));
    }

    return next(err);
  }
}
