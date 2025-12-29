/**
 * Subscription model
 */

import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending';
export type BillingCycle = 'monthly' | 'yearly';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  priceCents: number;
  billingCycle: BillingCycle;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    planId: {
      type: String,
      required: [true, 'Plan ID is required'],
    },
    planName: {
      type: String,
      required: [true, 'Plan name is required'],
      maxlength: [100, 'Plan name cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'pending'],
      default: 'pending',
      required: true,
      index: true,
    },
    priceCents: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: [true, 'Billing cycle is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      default: Date.now,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (this: ISubscription, value: Date) {
          return !value || value > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ endDate: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);


