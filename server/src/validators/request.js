import { z } from 'zod';

const bloodGroups = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'];

export const createRequestSchema = z.object({
  bloodGroup: z.enum(bloodGroups),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  hospitalName: z.string().min(2).max(150),
  requiredDate: z.string().datetime(),
  unitsRequired: z.coerce.number().int().min(1).max(20),
  contactPreference: z.enum(['EMAIL', 'PHONE']),
  additionalDetails: z.string().max(1000).optional().nullable(),
});

export const updateRequestSchema = createRequestSchema.partial().extend({
  status: z.enum(['OPEN', 'FULFILLED', 'CANCELLED']).optional(),
});

export const listRequestsSchema = z.object({
  bloodGroup: z.enum(bloodGroups).optional(),
  city: z.string().optional(),
  status: z.enum(['OPEN', 'FULFILLED', 'CANCELLED']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(9),
});

export const responseSchema = z.object({
  message: z.string().max(500).optional().nullable(),
});
