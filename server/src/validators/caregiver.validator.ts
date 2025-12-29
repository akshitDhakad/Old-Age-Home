/**
 * Caregiver validation schemas
 */

import { z } from 'zod';

export const createCaregiverProfileSchema = z.object({
  services: z.array(z.string()).min(1, 'At least one service is required'),
  experienceYears: z.number().min(0).max(50),
  hourlyRate: z.number().positive().optional(),
  bio: z.string().max(500).optional(),
});

export const updateCaregiverProfileSchema = z.object({
  services: z.array(z.string()).optional(),
  experienceYears: z.number().min(0).max(50).optional(),
  hourlyRate: z.number().positive().optional(),
  bio: z.string().max(500).optional(),
  availability: z
    .object({
      days: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])),
      startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
      endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
      timezone: z.string().default('Asia/Kolkata'),
    })
    .optional(),
});

export const searchCaregiversQuerySchema = z.object({
  city: z.string().optional(),
  service: z.string().optional(),
  minRating: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  maxPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  verificationStatus: z.enum(['pending', 'verified', 'rejected']).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export const updateVerificationStatusSchema = z.object({
  status: z.enum(['pending', 'verified', 'rejected']),
});


