/**
 * GET /api/search?q=keyword
 * Cari materi, video, glosarium, unduhan, dan kuis.
 */
import prisma from '../../lib/prisma.js';

function makeResultItem(type, title, subtitle, href) {
  return { type, title, subtitle, href };
}

export async function search(req, res, next) {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      return res.json({ results: [] });
    }

    const [sections, videos, glossary, downloads, quizzes] = await Promise.all([
      prisma.section.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
          ],
        },
        select: { id: true, name: true },
        take: 6,
      }),
      prisma.video.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { section: { name: { contains: q } } },
          ],
        },
        select: {
          id: true,
          title: true,
          section: { select: { name: true } },
        },
        take: 6,
      }),
      prisma.glossary.findMany({
        where: { term: { contains: q } },
        select: { id: true, term: true },
        take: 6,
      }),
      prisma.download.findMany({
        where: { title: { contains: q } },
        select: { id: true, title: true, category: true },
        take: 6,
      }),
      prisma.quiz.findMany({
        where: { title: { contains: q } },
        select: { id: true, title: true },
        take: 6,
      }),
    ]);

    const results = [
      ...sections.map((section) =>
        makeResultItem('materi', section.name, 'Materi', `/section/${section.id}`),
      ),
      ...videos.map((video) =>
        makeResultItem('video', video.title, `Video · ${video.section.name}`, `/video/${video.id}`),
      ),
      ...glossary.map((term) =>
        makeResultItem('glosarium', term.term, 'Glosarium', `/glosarium#term-${term.id}`),
      ),
      ...downloads.map((download) =>
        makeResultItem('unduhan', download.title, `Unduhan · ${download.category}`, `/unduhan?category=${encodeURIComponent(download.category)}`),
      ),
      ...quizzes.map((quiz) =>
        makeResultItem('kuis', quiz.title, 'Kuis', `/quiz/${quiz.id}`),
      ),
    ];

    res.json({ results });
  } catch (err) {
    next(err);
  }
}