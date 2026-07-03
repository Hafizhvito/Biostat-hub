import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const password = process.env.ADMIN_PASSWORD;

if (!password) {
  console.error('Error: ADMIN_PASSWORD wajib diisi di file .env');
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 10);

await prisma.adminUser.upsert({
  where: { username: 'admin' },
  update: { passwordHash },
  create: { username: 'admin', passwordHash },
});

console.log('Password admin berhasil direset.');
console.log('Username: admin');

await prisma.$disconnect();
