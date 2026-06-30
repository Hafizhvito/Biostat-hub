/**
 * Singleton Prisma Client — satu pintu akses ke database SQLite.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;