import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';
import { isNotFoundError } from '../../utils/prismaErrors.js';
import {
  validateStatTestCreate,
  validateStatTestIdParam,
  validateStatTestUpdate,
} from '../../validators/statTest.js';

export async function list(req, res, next) {
  try {
    const tests = await prisma.statTest.findMany({
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });

    res.json(tests);
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const payload = validateStatTestCreate(req.body ?? {});
    const test = await prisma.statTest.create({ data: payload });
    res.status(201).json(test);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = validateStatTestIdParam(req.params);
    const payload = validateStatTestUpdate(req.body ?? {});
    const test = await prisma.statTest.update({ where: { id }, data: payload });
    res.json(test);
  } catch (error) {
    if (isNotFoundError(error)) {
      return next(createError(404, 'Uji statistik tidak ditemukan.'));
    }
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = validateStatTestIdParam(req.params);
    await prisma.statTest.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (isNotFoundError(error)) {
      return next(createError(404, 'Uji statistik tidak ditemukan.'));
    }
    next(error);
  }
}