import { prisma } from '../config/prisma.js';
import { ok, created, fail } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const respondToRequest = asyncHandler(async (req, res) => {
  const request = await prisma.bloodRequest.findUnique({
    where: { id: req.params.id },
  });
  if (!request) return fail(res, 'Request not found', 404);
  if (request.status !== 'OPEN') return fail(res, 'Request is not open', 400);
  if (request.requesterId === req.user.id) {
    return fail(res, 'You cannot respond to your own request', 400);
  }

  const donorProfile = await prisma.donorProfile.findUnique({
    where: { userId: req.user.id },
  });
  if (!donorProfile || !donorProfile.isAvailable) return fail(res, 'Create an available donor profile first', 400);

  const existing = await prisma.donorResponse.findUnique({
    where: { requestId_donorId: { requestId: request.id, donorId: req.user.id } },
  });
  if (existing) {
    if (existing.status === 'WITHDRAWN') {
      const updated = await prisma.donorResponse.update({
        where: { id: existing.id },
        data: { status: 'PENDING', message: req.body.message || null },
      });
      return ok(res, updated);
    }
    return fail(res, 'You already responded to this request', 409);
  }

  const response = await prisma.donorResponse.create({
    data: {
      requestId: request.id,
      donorId: req.user.id,
      message: req.body.message || null,
    },
  });
  return created(res, response);
});

export const withdrawResponse = asyncHandler(async (req, res) => {
  const response = await prisma.donorResponse.findUnique({
    where: { id: req.params.id },
  });
  if (!response) return fail(res, 'Response not found', 404);
  if (response.donorId !== req.user.id) return fail(res, 'Not authorized', 403);

  const updated = await prisma.donorResponse.update({
    where: { id: response.id },
    data: { status: 'WITHDRAWN' },
  });
  return ok(res, updated);
});

export const listResponsesForRequest = asyncHandler(async (req, res) => {
  const request = await prisma.bloodRequest.findUnique({
    where: { id: req.params.id },
  });
  if (!request) return fail(res, 'Request not found', 404);
  if (request.requesterId !== req.user.id && req.user.role !== 'ADMIN') {
    return fail(res, 'Not authorized', 403);
  }

  const responses = await prisma.donorResponse.findMany({
    where: { requestId: request.id, status: { not: 'WITHDRAWN' } },
    include: {
      donor: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          donorProfile: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return ok(res, responses);
});

export const updateResponseStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['ACCEPTED', 'DECLINED'].includes(status)) {
    return fail(res, 'Invalid status', 400);
  }

  const response = await prisma.donorResponse.findUnique({
    where: { id: req.params.id },
    include: { request: true },
  });
  if (!response) return fail(res, 'Response not found', 404);
  if (response.request.requesterId !== req.user.id && req.user.role !== 'ADMIN') {
    return fail(res, 'Not authorized', 403);
  }

  const updated = await prisma.donorResponse.update({
    where: { id: response.id },
    data: { status },
  });
  return ok(res, updated);
});

export const myResponses = asyncHandler(async (req, res) => {
  const items = await prisma.donorResponse.findMany({
    where: { donorId: req.user.id },
    include: {
      request: {
        include: { requester: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return ok(res, items);
});
