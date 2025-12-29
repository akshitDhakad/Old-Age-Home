/**
 * Booking validation schemas
 */

import { z } from 'zod';

export const createBookingSchema = z.object({
  caregiverId: z.string().min(1, 'Caregiver ID is required'),
  startTime: z.string().datetime('Invalid start time format'),
  endTime: z.string().datetime('Invalid end time format').optional(),
  address: z.string().min(10, 'Address must be at least 10 characters').max(500),
  notes: z.string().max(500).optional(),
});

export const updateBookingSchema = z.object({
  status: z.enum(['requested', 'confirmed', 'in_progress', 'completed', 'cancelled']).optional(),
  endTime: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
});

export const getBookingsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});


