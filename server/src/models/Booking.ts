/**
 * Booking model
 */

import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { ICaregiverProfile } from './CaregiverProfile';

export type BookingStatus = 'requested' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId | IUser;
  caregiverId?: mongoose.Types.ObjectId | ICaregiverProfile;
  startTime: Date;
  endTime?: Date;
  status: BookingStatus;
  priceCents: number;
  address: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    caregiverId: {
      type: Schema.Types.ObjectId,
      ref: 'CaregiverProfile',
      index: true,
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      validate: {
        validator: function (this: IBooking, value: Date) {
          return !value || value > this.startTime;
        },
        message: 'End time must be after start time',
      },
    },
    status: {
      type: String,
      enum: ['requested', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'requested',
      required: true,
      index: true,
    },
    priceCents: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      minlength: [10, 'Address must be at least 10 characters'],
      maxlength: [500, 'Address cannot exceed 500 characters'],
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ caregiverId: 1, status: 1 });
bookingSchema.index({ startTime: 1 });
bookingSchema.index({ createdAt: -1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);


