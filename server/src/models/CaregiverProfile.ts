/**
 * Caregiver Profile model
 */

import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface IDocument {
  type: string;
  url: string;
  uploadedAt: Date;
  verified: boolean;
}

export interface IAvailability {
  days: string[];
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface ICaregiverProfile extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  services: string[];
  experienceYears: number;
  verified: boolean;
  verificationStatus: VerificationStatus;
  documents: IDocument[];
  rating?: number;
  hourlyRate?: number;
  bio?: string;
  availability?: IAvailability;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    type: {
      type: String,
      required: true,
      enum: ['id_proof', 'qualification', 'background_check', 'other'],
    },
    url: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const availabilitySchema = new Schema<IAvailability>(
  {
    days: {
      type: [String],
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      default: [],
    },
    startTime: {
      type: String,
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'],
    },
    endTime: {
      type: String,
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'],
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
  },
  { _id: false }
);

const caregiverProfileSchema = new Schema<ICaregiverProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    services: {
      type: [String],
      required: [true, 'At least one service is required'],
      enum: ['nursing', 'physiotherapy', 'adl', 'companionship', 'medication', 'other'],
    },
    experienceYears: {
      type: Number,
      required: [true, 'Experience years is required'],
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience cannot exceed 50 years'],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    documents: {
      type: [documentSchema],
      default: [],
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    hourlyRate: {
      type: Number,
      min: [0, 'Hourly rate cannot be negative'],
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    availability: {
      type: availabilitySchema,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
caregiverProfileSchema.index({ userId: 1 });
caregiverProfileSchema.index({ verificationStatus: 1 });
caregiverProfileSchema.index({ verified: 1 });
caregiverProfileSchema.index({ 'availability.days': 1 });

export const CaregiverProfile = mongoose.model<ICaregiverProfile>(
  'CaregiverProfile',
  caregiverProfileSchema
);


