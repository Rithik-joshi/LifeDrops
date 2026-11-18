import { prisma } from '../config/prisma.js';
import { ok, created, fail } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const upsertMyDonorProfile = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.lastDonationDate) data.lastDonationDate = new Date(data.lastDonationDate);

  const existing = await prisma.donorProfile.findUnique({
    where: { userId: req.user.id },
  });

  const profile = existing
    ? await prisma.donorProfile.update({ where: { userId: req.user.id }, data })
    : await prisma.donorProfile.create({ data: { ...data, userId: req.user.id } });

  return existing ? ok(res, profile) : created(res, profile);
});

export const getMyDonorProfile = asyncHandler(async (req, res) => {
  const profile = await prisma.donorProfile.findUnique({
    where: { userId: req.user.id },
  });
  if (!profile) return fail(res, 'Donor profile not found', 404);
  return ok(res, profile);
});

export const updateMyDonorProfile = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.lastDonationDate) data.lastDonationDate = new Date(data.lastDonationDate);

  const profile = await prisma.donorProfile.update({
    where: { userId: req.user.id },
    data,
  });
  return ok(res, profile);
});

export const searchDonors = asyncHandler(async (req, res) => {
  const { city, bloodGroup, availableOnly, page, pageSize } = req.query;

  const where = { isDiscoverable: true };
  if (city) where.city = { contains: city, mode: 'insensitive' };
  if (bloodGroup) where.bloodGroup = bloodGroup;
  if (availableOnly === 'true') where.isAvailable = true;

  const [total, items] = await Promise.all([
    prisma.donorProfile.count({ where }),
    prisma.donorProfile.findMany({
      where,
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  // Only expose contact info if donor opted in (isDiscoverable = true)
  const sanitized = items.map((d) => ({
    id: d.id,
    bloodGroup: d.bloodGroup,
    city: d.city,
    state: d.state,
    isAvailable: d.isAvailable,
    lastDonationDate: d.lastDonationDate,
    preferredContact: d.preferredContact,
    donor: {
      id: d.user.id,
      name: d.user.name,
      email: null,
      phone: null,
    },
  }));

  return ok(res, { items: sanitized, total, page, pageSize });
});
