import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const password = process.env.ADMIN_PASSWORD || 'BiostatHub2026';

const passwordHash = await bcrypt.hash(password, 10);

await prisma.adminUser.upsert({
  where: { username: 'admin' },
  update: { passwordHash },
  create: { username: 'admin', passwordHash },
});

console.log('Password admin direset.');
console.log('Username: admin');
console.log('Password:', password);

await prisma.$disconnect();
