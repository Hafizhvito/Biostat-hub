/**
 * Seed awal: 1 akun admin + pengaturan beranda.
 * Tidak mengisi materi/video (diisi klien lewat admin).
 */

﻿import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

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
    update: {},
    create: {
      id: 1,
      heroTitle: 'Biostat Hub',
      heroDescription:
        'Platform pembelajaran mandiri uji statistik dan pengolahan data SPSS — Fakultas Kedokteran YARSI.',
    },
  });

  console.log('Seed selesai: admin + pengaturan beranda.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
