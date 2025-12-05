/**
 * Zod schemas for runtime validation
 * These schemas can be used for form validation and API response validation
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['customer', 'caregiver']).default('customer'),
});

export const caregiverProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  services: z.array(z.string()).nonempty('Select at least one service'),
  experienceYears: z.number().min(0).max(50),
  hourlyRate: z.number().positive().optional(),
  bio: z.string().max(500).optional(),
});

export const documentUploadSchema = z.object({
  type: z.enum(['id_proof', 'qualification', 'background_check', 'other']),
  file: z.instanceof(File),
});

export const bookingSchema = z.object({
  caregiverId: z.string().min(1, 'Caregiver is required'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  address: z.string().min(10, 'Address is required'),
  notes: z.string().max(500).optional(),
});

export const searchFiltersSchema = z.object({
  city: z.string().optional(),
  service: z.string().optional(),
  minRating: z.number().min(0).max(5).optional(),
  maxPrice: z.number().positive().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CaregiverProfileInput = z.infer<typeof caregiverProfileSchema>;
export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type SearchFiltersInput = z.infer<typeof searchFiltersSchema>;

