/**
 * Notification model
 * Stores in-app notifications for users
 */

import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export type NotificationType = 'emergency' | 'booking' | 'system' | 'alert';
export type NotificationStatus = 'unread' | 'read';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['emergency', 'booking', 'system', 'alert'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['unread', 'read'],
      default: 'unread',
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
notificationSchema.index({ userId: 1, status: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>(
  'Notification',
  notificationSchema
);

