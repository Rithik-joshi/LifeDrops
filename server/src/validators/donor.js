import { z } from 'zod';

const bloodGroups = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'];

export const upsertDonorSchema = z.object({
  bloodGroup: z.enum(bloodGroups),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  isAvailable: z.boolean().optional(),
  isDiscoverable: z.boolean().optional(),
  lastDonationDate: z.string().datetime().optional().nullable(),
  preferredContact: z.enum(['EMAIL', 'PHONE']).optional(),
});

export const updateDonorSchema = upsertDonorSchema.partial();

export const donorSearchSchema = z.object({
  city: z.string().optional(),
  bloodGroup: z.enum(bloodGroups).optional(),
  availableOnly: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(9),
});
