/**
 * Singleton Prisma Client — satu pintu akses ke database MySQL.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;
