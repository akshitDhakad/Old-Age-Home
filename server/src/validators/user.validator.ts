/**
 * User validation schemas
 */

import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  city: z.string().max(100).optional(),
});

export const getUserQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  role: z.enum(['customer', 'caregiver', 'vendor', 'admin']).optional(),
  city: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
});


