import prisma from '../../lib/prisma.js';

export async function list(req, res, next) {
  try {
    const items = await prisma.calculatorLink.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      select: {
        id: true,
        title: true,
        url: true,
      },
    });

    res.json(items);
  } catch (error) {
    next(error);
  }
}
