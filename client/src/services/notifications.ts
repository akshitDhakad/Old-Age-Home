/**
 * Notification Service
 * Handles user notifications
 */

import { apiGet, apiPatch, apiDelete } from '../api/client';

export interface Notification {
  _id: string;
  userId: string;
  type: 'emergency' | 'booking' | 'system' | 'alert';
  title: string;
  message: string;
  status: 'unread' | 'read';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  unreadCount: number;
}

/**
 * Get user notifications
 */
export async function getNotifications(params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}): Promise<NotificationsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.limit) queryParams.set('limit', String(params.limit));
  if (params?.unreadOnly) queryParams.set('unreadOnly', 'true');

  const queryString = queryParams.toString();
  return apiGet<NotificationsResponse>(
    `/notifications${queryString ? `?${queryString}` : ''}`
  );
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<Notification> {
  return apiPatch<Notification>(`/notifications/${notificationId}/read`, {});
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  return apiPatch<void>('/notifications/read-all', {});
}

/**
 * Delete notification
 */
export async function deleteNotification(
  notificationId: string
): Promise<void> {
  return apiDelete<void>(`/notifications/${notificationId}`);
}

