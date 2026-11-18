import { prisma } from '../config/prisma.js';
import { ok, created, fail } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listRequests = asyncHandler(async (req, res) => {
  const { bloodGroup, city, status, page, pageSize } = req.query;

  const where = {};
  if (bloodGroup) where.bloodGroup = bloodGroup;
  if (city) where.city = { contains: city, mode: 'insensitive' };
  where.status = status || 'OPEN';

  const [total, items] = await Promise.all([
    prisma.bloodRequest.count({ where }),
    prisma.bloodRequest.findMany({
      where,
      include: {
        requester: { select: { id: true, name: true } },
        _count: { select: { responses: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return ok(res, { items, total, page, pageSize });
});

export const getRequest = asyncHandler(async (req, res) => {
  const request = await prisma.bloodRequest.findUnique({
    where: { id: req.params.id },
    include: {
      requester: { select: { id: true, name: true } },
      _count: { select: { responses: true } },
    },
  });
  if (!request) return fail(res, 'Request not found', 404);
  return ok(res, request);
});

export const createRequest = asyncHandler(async (req, res) => {
  const data = { ...req.body, requesterId: req.user.id };
  data.requiredDate = new Date(data.requiredDate);
  const request = await prisma.bloodRequest.create({ data });
  return created(res, request);
});

export const updateRequest = asyncHandler(async (req, res) => {
  const existing = await prisma.bloodRequest.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) return fail(res, 'Request not found', 404);
  if (existing.requesterId !== req.user.id && req.user.role !== 'ADMIN') {
    return fail(res, 'Not authorized', 403);
  }

  const data = { ...req.body };
  if (data.requiredDate) data.requiredDate = new Date(data.requiredDate);

  const updated = await prisma.bloodRequest.update({
    where: { id: req.params.id },
    data,
  });
  return ok(res, updated);
});

export const cancelRequest = asyncHandler(async (req, res) => {
  const existing = await prisma.bloodRequest.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) return fail(res, 'Request not found', 404);
  if (existing.requesterId !== req.user.id && req.user.role !== 'ADMIN') {
    return fail(res, 'Not authorized', 403);
  }
  const updated = await prisma.bloodRequest.update({
    where: { id: req.params.id },
    data: { status: 'CANCELLED' },
  });
  return ok(res, updated);
});

export const fulfillRequest = asyncHandler(async (req, res) => {
  const existing = await prisma.bloodRequest.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) return fail(res, 'Request not found', 404);
  if (existing.requesterId !== req.user.id && req.user.role !== 'ADMIN') {
    return fail(res, 'Not authorized', 403);
  }
  const updated = await prisma.bloodRequest.update({
    where: { id: req.params.id },
    data: { status: 'FULFILLED' },
  });
  return ok(res, updated);
});

export const myRequests = asyncHandler(async (req, res) => {
  const items = await prisma.bloodRequest.findMany({
    where: { requesterId: req.user.id },
    include: { _count: { select: { responses: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return ok(res, items);
});
