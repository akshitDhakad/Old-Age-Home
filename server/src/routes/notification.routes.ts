/**
 * Notification routes
 */

import { Router } from 'express';
import { notificationController } from '../controllers/NotificationController';
import { protect } from '../middleware/auth';

const router: Router = Router();

// All routes require authentication
router.use(protect);

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

export default router;

