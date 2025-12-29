/**
 * Caregiver service
 * Handles caregiver profile-related business logic
 */

import { CaregiverProfile, ICaregiverProfile } from '../models/CaregiverProfile';
import { User } from '../models/User';
import { NotFoundError, BadRequestError } from '../utils/errors/AppError';

export interface CreateCaregiverProfileData {
  userId: string;
  services: string[];
  experienceYears: number;
  hourlyRate?: number;
  bio?: string;
}

export interface UpdateCaregiverProfileData {
  services?: string[];
  experienceYears?: number;
  hourlyRate?: number;
  bio?: string;
  availability?: {
    days: string[];
    startTime: string;
    endTime: string;
    timezone: string;
  };
}

export interface SearchFilters {
  city?: string;
  service?: string;
  minRating?: number;
  maxPrice?: number;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  page?: number;
  limit?: number;
}

export class CaregiverService {
  /**
   * Create caregiver profile
   */
  public async createProfile(data: CreateCaregiverProfileData): Promise<ICaregiverProfile> {
    // Check if user exists and is a caregiver
    const user = await User.findById(data.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (user.role !== 'caregiver') {
      throw new BadRequestError('User must have caregiver role');
    }

    // Check if profile already exists
    const existingProfile = await CaregiverProfile.findOne({ userId: data.userId });
    if (existingProfile) {
      throw new BadRequestError('Caregiver profile already exists');
    }

    const profile = await CaregiverProfile.create({
      userId: data.userId,
      services: data.services,
      experienceYears: data.experienceYears,
      hourlyRate: data.hourlyRate,
      bio: data.bio,
    });

    return profile;
  }

  /**
   * Get caregiver profile by user ID
   */
  public async getProfileByUserId(userId: string): Promise<ICaregiverProfile> {
    const profile = await CaregiverProfile.findOne({ userId }).populate('userId', 'name email city');
    if (!profile) {
      throw new NotFoundError('Caregiver profile not found');
    }
    return profile;
  }

  /**
   * Update caregiver profile
   */
  public async updateProfile(
    userId: string,
    data: UpdateCaregiverProfileData
  ): Promise<ICaregiverProfile> {
    const profile = await this.getProfileByUserId(userId);

    if (data.services) profile.services = data.services;
    if (data.experienceYears !== undefined) profile.experienceYears = data.experienceYears;
    if (data.hourlyRate !== undefined) profile.hourlyRate = data.hourlyRate;
    if (data.bio !== undefined) profile.bio = data.bio;
    if (data.availability) profile.availability = data.availability;

    await profile.save();
    return profile;
  }

  /**
   * Search caregivers with filters
   */
  public async searchCaregivers(filters: SearchFilters = {}) {
    const {
      city,
      service,
      minRating,
      maxPrice,
      verificationStatus,
      page = 1,
      limit = 10,
    } = filters;

    const skip = (page - 1) * limit;
    const query: any = {};

    // Build query
    if (verificationStatus) {
      query.verificationStatus = verificationStatus;
    } else {
      query.verified = true; // Only show verified by default
    }

    if (service) {
      query.services = { $in: [service] };
    }

    if (minRating !== undefined) {
      query.rating = { $gte: minRating };
    }

    if (maxPrice !== undefined) {
      query.hourlyRate = { ...query.hourlyRate, $lte: maxPrice };
    }

    // If city filter, need to join with User
    let aggregationPipeline: any[] = [
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
    ];

    if (city) {
      aggregationPipeline.push({
        $match: { 'user.city': { $regex: city, $options: 'i' } },
      });
    }

    aggregationPipeline.push(
      { $skip: skip },
      { $limit: limit },
      { $sort: { rating: -1, createdAt: -1 } }
    );

    const profiles = await CaregiverProfile.aggregate(aggregationPipeline);

    // Get total count
    const countQuery = { ...query };
    if (city) {
      const usersInCity = await User.find({ city: { $regex: city, $options: 'i' } }).select('_id');
      countQuery.userId = { $in: usersInCity.map((u) => u._id) };
    }

    const total = await CaregiverProfile.countDocuments(countQuery);

    return {
      data: profiles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update verification status (admin only)
   */
  public async updateVerificationStatus(
    userId: string,
    status: 'pending' | 'verified' | 'rejected'
  ): Promise<ICaregiverProfile> {
    const profile = await this.getProfileByUserId(userId);
    profile.verificationStatus = status;
    profile.verified = status === 'verified';
    await profile.save();
    return profile;
  }

  /**
   * Add document to profile
   */
  public async addDocument(
    userId: string,
    document: { type: string; url: string }
  ): Promise<ICaregiverProfile> {
    const profile = await this.getProfileByUserId(userId);
    profile.documents.push({
      type: document.type,
      url: document.url,
      uploadedAt: new Date(),
      verified: false,
    });
    await profile.save();
    return profile;
  }
}

export const caregiverService = new CaregiverService();


