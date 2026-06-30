/**
 * API publik: baca teks hero beranda (judul + deskripsi).
 */

import prisma from '../../lib/prisma.js';

export async function get(req, res, next) {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
      select: {
        heroTitle: true,
        heroDescription: true,
      },
    });

    res.json({
      hero_title: settings?.heroTitle ?? '',
      hero_description: settings?.heroDescription ?? '',
    });
  } catch (err) {
    next(err);
  }
}
