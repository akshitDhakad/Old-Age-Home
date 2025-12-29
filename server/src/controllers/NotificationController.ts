/**
 * Notification Controller
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { notificationService } from '../services/NotificationService';
import { asyncHandler } from '../utils/errors/errorHandler';

export class NotificationController {
  /**
   * Get user notifications
   */
  public getNotifications = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const unreadOnly = req.query.unreadOnly === 'true';

      const result = await notificationService.getUserNotifications(
        req.user!.userId,
        page,
        limit,
        unreadOnly
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    }
  );

  /**
   * Mark notification as read
   */
  public markAsRead = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      const notification = await notificationService.markAsRead(
        req.params.id,
        req.user!.userId
      );

      res.status(200).json({
        success: true,
        data: notification,
      });
    }
  );

  /**
   * Mark all notifications as read
   */
  public markAllAsRead = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      await notificationService.markAllAsRead(req.user!.userId);

      res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
      });
    }
  );

  /**
   * Delete notification
   */
  public deleteNotification = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      await notificationService.deleteNotification(
        req.params.id,
        req.user!.userId
      );

      res.status(200).json({
        success: true,
        message: 'Notification deleted',
      });
    }
  );
}

export const notificationController = new NotificationController();

