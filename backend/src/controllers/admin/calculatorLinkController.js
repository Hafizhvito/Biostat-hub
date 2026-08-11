import prisma from '../../lib/prisma.js';
import { createError } from '../../middleware/errorHandler.js';
import { isNotFoundError } from '../../utils/prismaErrors.js';
import {
  validateCalculatorLinkCreate,
  validateCalculatorLinkIdParam,
  validateCalculatorLinkUpdate,
} from '../../validators/calculatorLink.js';

export async function list(req, res, next) {
  try {
    const items = await prisma.calculatorLink.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const payload = validateCalculatorLinkCreate(req.body ?? {});
    const aggregate = await prisma.calculatorLink.aggregate({ _max: { sortOrder: true } });
    const nextSortOrder = (aggregate._max.sortOrder ?? 0) + 1;

    const item = await prisma.calculatorLink.create({
      data: {
        title: payload.title,
        url: payload.url,
        sortOrder: nextSortOrder,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = validateCalculatorLinkIdParam(req.params);
    const payload = validateCalculatorLinkUpdate(req.body ?? {});

    const item = await prisma.calculatorLink.update({
      where: { id },
      data: payload,
    });

    res.json(item);
  } catch (error) {
    if (isNotFoundError(error)) {
      return next(createError(404, 'Link kalkulator tidak ditemukan.'));
    }
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = validateCalculatorLinkIdParam(req.params);
    await prisma.calculatorLink.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (isNotFoundError(error)) {
      return next(createError(404, 'Link kalkulator tidak ditemukan.'));
    }
    next(error);
  }
}
