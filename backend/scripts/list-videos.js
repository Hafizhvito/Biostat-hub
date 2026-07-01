import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const videos = await prisma.video.findMany({
  select: { id: true, title: true, youtubeUrl: true },
});
console.log(JSON.stringify(videos, null, 2));
await prisma.$disconnect();
