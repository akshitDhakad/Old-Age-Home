/**
 * Device model
 */

import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IDevice extends Document {
  vendorId: mongoose.Types.ObjectId | IUser;
  name: string;
  type: string;
  description?: string;
  rentalPriceCents: number;
  available: boolean;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

const deviceSchema = new Schema<IDevice>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Device name is required'],
      trim: true,
      minlength: [2, 'Device name must be at least 2 characters'],
      maxlength: [100, 'Device name cannot exceed 100 characters'],
    },
    type: {
      type: String,
      required: [true, 'Device type is required'],
      enum: ['monitor', 'alert', 'medication_dispenser', 'mobility_aid', 'other'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    rentalPriceCents: {
      type: Number,
      required: [true, 'Rental price is required'],
      min: [0, 'Rental price cannot be negative'],
    },
    available: {
      type: Boolean,
      default: true,
      index: true,
    },
    features: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
deviceSchema.index({ vendorId: 1, available: 1 });
deviceSchema.index({ type: 1, available: 1 });
deviceSchema.index({ name: 'text', description: 'text' }); // Text search index

export const Device = mongoose.model<IDevice>('Device', deviceSchema);


