import prisma from '../../lib/prisma.js';
import { toPublicUploadUrl } from '../../utils/upload.js';

function toResponse(item) {
  return {
    ...item,
    imageUrl: toPublicUploadUrl('wizard', item.filename),
  };
}

export async function list(req, res, next) {
  try {
    const items = await prisma.wizardImage.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    res.json(items.map(toResponse));
  } catch (error) {
    next(error);
  }
}