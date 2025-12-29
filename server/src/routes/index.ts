/**
 * Routes export
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import caregiverRoutes from './caregiver.routes';
import bookingRoutes from './booking.routes';
import emergencyRoutes from './emergency.routes';
import notificationRoutes from './notification.routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/caregivers', caregiverRoutes);
router.use('/bookings', bookingRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/notifications', notificationRoutes);

export default router;

