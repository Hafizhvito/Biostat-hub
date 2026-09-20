/**
 * API publik: baca teks hero beranda (judul + deskripsi).
 */

import prisma from '../../lib/prisma.js';

export async function get(req, res, next) {
  try {
    const [settings, glossaryCount, downloadCount] = await Promise.all([
      prisma.siteSettings.findUnique({
        where: { id: 1 },
        select: {
          heroTitle: true,
          heroDescription: true,
          contactEmail: true,
          calculatorUrl: true,
        },
      }),
      prisma.glossary.count(),
      prisma.download.count(),
    ]);

    res.json({
      hero_title: settings?.heroTitle ?? '',
      hero_description: settings?.heroDescription ?? '',
      contact_email: settings?.contactEmail ?? 'risethub.support@gmail.com',
      calculator_url: settings?.calculatorUrl ?? '',
      glossary_count: glossaryCount,
      download_count: downloadCount,
    });
  } catch (err) {
    next(err);
  }
}
