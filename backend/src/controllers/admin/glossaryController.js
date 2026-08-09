import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';
import { isNotFoundError } from '../../utils/prismaErrors.js';
import {
  validateGlossaryCreate,
  validateGlossaryIdParam,
  validateGlossaryUpdate,
} from '../../validators/glossary.js';

export async function list(req, res, next) {
  try {
    const terms = await prisma.glossary.findMany({
      orderBy: [{ term: 'asc' }, { id: 'asc' }],
    });

    res.json(terms);
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const payload = validateGlossaryCreate(req.body ?? {});
    const term = await prisma.glossary.create({
      data: payload,
    });

    res.status(201).json(term);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = validateGlossaryIdParam(req.params);
    const payload = validateGlossaryUpdate(req.body ?? {});

    const term = await prisma.glossary.update({
      where: { id },
      data: payload,
    });

    res.json(term);
  } catch (error) {
    if (isNotFoundError(error)) {
      return next(createError(404, 'Istilah tidak ditemukan.'));
    }
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = validateGlossaryIdParam(req.params);
    await prisma.glossary.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (isNotFoundError(error)) {
      return next(createError(404, 'Istilah tidak ditemukan.'));
    }
    next(error);
  }
}