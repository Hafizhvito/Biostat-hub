/**
 * Seed awal: 1 akun admin + pengaturan beranda.
 * Tidak mengisi materi/video (diisi klien lewat admin).
 */

﻿import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD wajib diisi di file .env sebelum menjalankan seed.');
  }
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { username: process.env.ADMIN_USERNAME || 'admin' },
    update: { passwordHash },
    create: {
      username: process.env.ADMIN_USERNAME || 'admin',
      passwordHash,
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      heroTitle: 'Riset Hub',
      heroDescription:
        'Platform pembelajaran mandiri Riset dan Pengolahan Data Penelitian Kesehatan dengan SPSS',
    },
    create: {
      id: 1,
      heroTitle: 'Riset Hub',
      heroDescription:
        'Platform pembelajaran mandiri Riset dan Pengolahan Data Penelitian Kesehatan dengan SPSS',
      contactEmail: 'risethub.support@gmail.com',
    },
  });

  console.log('Seed selesai: admin + pengaturan beranda.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
