import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { signToken } from '../utils/jwt.js';
import { ok, created, fail } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const publicUser = (u) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  phone: u.phone,
  role: u.role,
  createdAt: u.createdAt,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return fail(res, 'Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  const token = signToken({ sub: user.id, role: user.role });
  return created(res, { token, user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return fail(res, 'Invalid credentials', 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return fail(res, 'Invalid credentials', 401);

  const token = signToken({ sub: user.id, role: user.role });
  return ok(res, { token, user: publicUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { donorProfile: true },
  });
  return ok(res, { ...publicUser(user), donorProfile: user.donorProfile });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, currentPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  const data = {};
  if (name !== undefined) data.name = name;
  if (phone !== undefined) data.phone = phone;

  if (newPassword) {
    if (!currentPassword) return fail(res, 'Current password required', 400);
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return fail(res, 'Current password is incorrect', 400);
    data.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data,
  });
  return ok(res, publicUser(updated));
});
