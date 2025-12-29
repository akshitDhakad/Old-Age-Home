/**
 * Emergency Request routes
 */

import { Router } from 'express';
import { emergencyRequestController } from '../controllers/EmergencyRequestController';
import { protect } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { z } from 'zod';

const router: Router = Router();

// Emergency request schema
const createEmergencyRequestSchema = z.object({
  caregiverId: z.string().optional(),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  notes: z.string().optional(),
  phone: z.string().optional(),
});

// All routes require authentication
router.use(protect);

router.post(
  '/',
  validateBody(createEmergencyRequestSchema),
  emergencyRequestController.createEmergencyRequest
);

router.get('/', emergencyRequestController.getEmergencyRequests);

export default router;

