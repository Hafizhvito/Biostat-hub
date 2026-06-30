/**
 * Admin: baca & ubah pengaturan beranda (hero title/description).
 */

import prisma from '../../lib/prisma.js';
import { validateSettingsUpdate } from '../../validators/settings.js';

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
      heroTitle: settings?.heroTitle ?? '',
      heroDescription: settings?.heroDescription ?? '',
    });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const payload = validateSettingsUpdate(req.body ?? {});

    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {
        heroTitle: payload.heroTitle,
        heroDescription: payload.heroDescription,
      },
      create: {
        id: 1,
        heroTitle: payload.heroTitle,
        heroDescription: payload.heroDescription,
      },
      select: {
        heroTitle: true,
        heroDescription: true,
      },
    });

    res.json(settings);
  } catch (err) {
    next(err);
  }
}
