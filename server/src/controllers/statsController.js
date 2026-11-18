import { prisma } from '../config/prisma.js';
import { ok } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const publicStats = asyncHandler(async (_req, res) => {
  const [donors, requests, fulfilled, cities] = await Promise.all([
    prisma.donorProfile.count({ where: { isDiscoverable: true } }),
    prisma.bloodRequest.count({ where: { status: 'OPEN' } }),
    prisma.bloodRequest.count({ where: { status: 'FULFILLED' } }),
    prisma.donorProfile.findMany({
      where: { isDiscoverable: true },
      select: { city: true },
      distinct: ['city'],
    }),
  ]);
  return ok(res, {
    donors,
    openRequests: requests,
    fulfilledRequests: fulfilled,
    cities: cities.length,
  });
});
