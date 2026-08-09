import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';

function parseId(value) {
  const id = Number.parseInt(value, 10);
  if (Number.isNaN(id) || id <= 0) {
    throw createError(400, 'ID glosarium tidak valid.');
  }
  return id;
}

export async function list(req, res, next) {
  try {
    const q = String(req.query.q || '').trim();
    const letter = String(req.query.letter || '').trim();

    const where = {};
    if (q) {
      where.term = { contains: q };
    }
    if (letter && letter !== 'all') {
      where.term = { startsWith: letter };
    }

    const terms = await prisma.glossary.findMany({
      where,
      orderBy: [{ term: 'asc' }, { id: 'asc' }],
    });

    res.json(terms);
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const term = await prisma.glossary.findUnique({ where: { id } });

    if (!term) {
      throw createError(404, 'Istilah tidak ditemukan.');
    }

    res.json(term);
  } catch (error) {
    next(error);
  }
}