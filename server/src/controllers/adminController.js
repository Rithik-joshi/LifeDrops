import { prisma } from '../config/prisma.js';
import { ok, fail } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const pageSize = Math.min(parseInt(req.query.pageSize || '20', 10), 100);

  const [total, items] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        donorProfile: { select: { id: true, isDiscoverable: true, city: true, bloodGroup: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return ok(res, { items, total, page, pageSize });
});

export const listAllRequests = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const pageSize = Math.min(parseInt(req.query.pageSize || '20', 10), 100);

  const [total, items] = await Promise.all([
    prisma.bloodRequest.count(),
    prisma.bloodRequest.findMany({
      include: { requester: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return ok(res, { items, total, page, pageSize });
});

export const disableDonor = asyncHandler(async (req, res) => {
  const profile = await prisma.donorProfile.findUnique({
    where: { id: req.params.id },
  });
  if (!profile) return fail(res, 'Donor profile not found', 404);

  const updated = await prisma.donorProfile.update({
    where: { id: profile.id },
    data: { isDiscoverable: false, isAvailable: false },
  });
  return ok(res, updated);
});

export const adminStats = asyncHandler(async (_req, res) => {
  const [users, donors, requests, openRequests, fulfilled, responses] = await Promise.all([
    prisma.user.count(),
    prisma.donorProfile.count(),
    prisma.bloodRequest.count(),
    prisma.bloodRequest.count({ where: { status: 'OPEN' } }),
    prisma.bloodRequest.count({ where: { status: 'FULFILLED' } }),
    prisma.donorResponse.count(),
  ]);
  return ok(res, { users, donors, requests, openRequests, fulfilled, responses });
});
