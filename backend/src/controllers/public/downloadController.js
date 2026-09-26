import fs from 'fs';
import path from 'path';
import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';
import { downloadUploadDir } from '../../utils/upload.js';

function parseId(value) {
  const id = Number.parseInt(value, 10);
  if (Number.isNaN(id) || id <= 0) {
    throw createError(400, 'ID unduhan tidak valid.');
  }
  return id;
}

function toResponse(download) {
  const { filename, ...response } = download;
  return response;
}

export async function getMaterialResource(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const resource = await prisma.download.findFirst({
      where: { id, sectionId: { not: null } },
      select: {
        id: true,
        title: true,
        description: true,
        originalName: true,
        fileSize: true,
        section: { select: { id: true, name: true } },
      },
    });

    if (!resource) {
      throw createError(404, 'Materi presentasi tidak ditemukan.');
    }

    res.json(resource);
  } catch (error) {
    next(error);
  }
}

export async function previewMaterialResource(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const resource = await prisma.download.findFirst({
      where: { id, sectionId: { not: null } },
    });

    if (!resource) {
      throw createError(404, 'Materi presentasi tidak ditemukan.');
    }

    if (path.extname(resource.originalName).toLowerCase() !== '.pdf') {
      throw createError(415, 'Materi harus berformat PDF agar dapat dibaca di website.');
    }

    const filePath = path.join(downloadUploadDir, resource.filename);
    try {
      await fs.promises.access(filePath, fs.constants.R_OK);
    } catch {
      throw createError(404, 'File materi tidak tersedia.');
    }

    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(resource.originalName)}`);
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://biostatresearch.com");
    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
}

export async function list(req, res, next) {
  try {
    const q = String(req.query.q || '').trim();
    const category = String(req.query.category || '').trim();

    const where = {};
    if (q) {
      where.title = { contains: q };
    }
    if (category && category !== 'all') {
      where.category = category;
    }

    const downloads = await prisma.download.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });

    res.json(downloads.map(toResponse));
  } catch (error) {
    next(error);
  }
}

export async function downloadFile(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const download = await prisma.download.findUnique({ where: { id } });

    if (!download) {
      throw createError(404, 'File unduhan tidak ditemukan.');
    }

    const filePath = path.join(downloadUploadDir, download.filename);
    try {
      await fs.promises.access(filePath, fs.constants.R_OK);
    } catch {
      throw createError(404, 'File unduhan tidak tersedia.');
    }

    res.download(filePath, download.originalName, (error) => {
      if (error) {
        if (!res.headersSent) next(error);
        else console.error('Pengiriman file unduhan gagal:', error);
        return;
      }

      prisma.download.update({
        where: { id },
        data: { downloadCount: { increment: 1 } },
      }).catch((updateError) => {
        console.error('Gagal memperbarui jumlah unduhan:', updateError);
      });
    });
  } catch (error) {
    next(error);
  }
}
