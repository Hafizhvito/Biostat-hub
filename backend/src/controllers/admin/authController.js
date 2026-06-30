/**
 * Login admin: verifikasi username/password, kembalikan JWT.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { createError } from '../../middleware/errorHandler.js';

export async function login(req, res, next) {
  try {
    const { username, password } = req.body ?? {};

    const admin = await prisma.adminUser.findUnique({
      where: { username },
    });

    const isPasswordValid =
      admin && typeof password === 'string'
        ? await bcrypt.compare(password, admin.passwordHash)
        : false;

    if (!admin || !isPasswordValid) {
      throw createError(401, 'Nama pengguna atau kata sandi salah');
    }

    const token = jwt.sign(
      { sub: admin.id, username },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    res.json({
      token,
      expires_in: env.jwtExpiresIn,
    });
  } catch (err) {
    next(err);
  }
}
