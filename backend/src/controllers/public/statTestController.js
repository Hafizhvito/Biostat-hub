import prisma from '../../lib/prisma.js';
import { toPublicUploadUrl } from '../../utils/upload.js';

function toResponse(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    imageUrl: toPublicUploadUrl('stat-tests', item.filename),
  };
}

export async function list(req, res, next) {
  try {
    const items = await prisma.statTest.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    res.json(items.map(toResponse));
  } catch (error) {
    next(error);
  }
}
