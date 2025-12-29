/**
 * Notification Service
 * Handles creating and managing in-app notifications
 */

import { Notification, INotification } from '../models/Notification';
import { User } from '../models/User';
import { emailService } from './EmailService';

export interface CreateNotificationData {
  userId: string | string[];
  type: 'emergency' | 'booking' | 'system' | 'alert';
  title: string;
  message: string;
  metadata?: Record<string, any>;
  sendEmail?: boolean;
}

export class NotificationService {
  /**
   * Create notification(s) for one or multiple users
   */
  public async createNotification(data: CreateNotificationData): Promise<INotification[]> {
    const userIds = Array.isArray(data.userId) ? data.userId : [data.userId];
    const notifications: INotification[] = [];

    for (const userId of userIds) {
      const notification = await Notification.create({
        userId,
        type: data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata || {},
        status: 'unread',
      });
      notifications.push(notification);
    }

    // Send email notifications if requested
    if (data.sendEmail) {
      await this.sendEmailNotifications(userIds, data);
    }

    return notifications;
  }

  /**
   * Send email notifications to users
   */
  private async sendEmailNotifications(
    userIds: string[],
    data: CreateNotificationData
  ): Promise<void> {
    try {
      const users = await User.find({ _id: { $in: userIds } }).select('email name');
      
      for (const user of users) {
        if (data.type === 'emergency') {
          // Emergency notifications use specialized email template
          const customerName = data.metadata?.customerName || 'Customer';
          const customerPhone = data.metadata?.customerPhone;
          const address = data.metadata?.address || '';
          const notes = data.metadata?.notes;

          await emailService.sendEmergencyNotification(
            user.email,
            user.name,
            customerName,
            customerPhone,
            address,
            notes
          );
        } else {
          // Generic notification email
          await emailService.sendEmail({
            to: user.email,
            subject: data.title,
            html: `
              <h2>${data.title}</h2>
              <p>${data.message}</p>
              <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard">View Dashboard</a></p>
            `,
            text: `${data.title}\n\n${data.message}\n\nView Dashboard: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`,
          });
        }
      }
    } catch (error) {
      console.error('Failed to send email notifications:', error);
      // Don't throw - email failures shouldn't break notification creation
    }
  }

  /**
   * Get notifications for a user
   */
  public async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 50,
    unreadOnly: boolean = false
  ) {
    const skip = (page - 1) * limit;
    const query: any = { userId };
    if (unreadOnly) {
      query.status = 'unread';
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ userId, status: 'unread' }),
    ]);

    return {
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  /**
   * Mark notification as read
   */
  public async markAsRead(notificationId: string, userId: string): Promise<INotification> {
    const notification = await Notification.findOne({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.status = 'read';
    await notification.save();
    return notification;
  }

  /**
   * Mark all notifications as read for a user
   */
  public async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany(
      { userId, status: 'unread' },
      { status: 'read' }
    );
  }

  /**
   * Delete notification
   */
  public async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const result = await Notification.deleteOne({
      _id: notificationId,
      userId,
    });

    if (result.deletedCount === 0) {
      throw new Error('Notification not found');
    }
  }
}

export const notificationService = new NotificationService();

