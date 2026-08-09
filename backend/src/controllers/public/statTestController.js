import prisma from '../../lib/prisma.js';

export async function list(req, res, next) {
  try {
    const dataType = String(req.query.data_type || '').trim();
    const dataDistribution = String(req.query.data_distribution || '').trim();

    const where = {};
    if (dataType && dataType !== 'all') {
      where.dataType = dataType;
    }
    if (dataDistribution && dataDistribution !== 'all') {
      where.dataDistribution = dataDistribution;
    }

    const tests = await prisma.statTest.findMany({
      where,
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });

    res.json(tests);
  } catch (error) {
    next(error);
  }
}