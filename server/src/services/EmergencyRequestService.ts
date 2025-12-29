/**
 * Emergency Request Service
 * Handles emergency care requests and notifications
 */

import { Booking, IBooking } from '../models/Booking';
import { User } from '../models/User';
import { CaregiverProfile } from '../models/CaregiverProfile';
import { notificationService } from './NotificationService';
import { bookingService } from './BookingService';
import { NotFoundError, BadRequestError } from '../utils/errors/AppError';

export interface CreateEmergencyRequestData {
  customerId: string;
  caregiverId?: string;
  address: string;
  notes?: string;
  phone?: string;
}

export class EmergencyRequestService {
  /**
   * Create emergency request and notify all caregivers and admins
   */
  public async createEmergencyRequest(
    data: CreateEmergencyRequestData
  ): Promise<IBooking> {
    // Get customer details
    const customer = await User.findById(data.customerId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    // If caregiverId is provided, create booking with that caregiver
    // Otherwise, create a general emergency request (no specific caregiver)
    let booking: IBooking;

    if (data.caregiverId) {
      // Create booking with specific caregiver
      booking = await bookingService.createBooking({
        customerId: data.customerId,
        caregiverId: data.caregiverId,
        startTime: new Date(),
        address: data.address,
        notes: data.notes || 'Emergency care request',
      });
    } else {
      // Create emergency booking without specific caregiver
      // Use a default price for emergency requests
      booking = await Booking.create({
        customerId: data.customerId,
        startTime: new Date(),
        address: data.address,
        notes: (data.notes || 'Emergency care request') + ' [EMERGENCY]',
        priceCents: 0, // Will be calculated when caregiver accepts
        status: 'requested',
      });
      
      // Populate customer for return
      await booking.populate([
        { path: 'customerId', select: 'name email phone' },
      ]);
    }

    // Get all active caregivers and admins
    const [caregivers, admins] = await Promise.all([
      CaregiverProfile.find({ verified: true })
        .populate('userId', 'name email phone')
        .lean(),
      User.find({ role: 'admin', isActive: true }).select('name email').lean(),
    ]);

    // Prepare notification data
    const notificationTitle = '🚨 Emergency Care Request';
    const notificationMessage = `Emergency care request from ${customer.name} at ${data.address}. ${data.notes ? `Details: ${data.notes}` : 'Please respond immediately.'}`;

    // Collect user IDs to notify
    const userIdsToNotify: string[] = [];

    // Add all caregiver user IDs
    caregivers.forEach((caregiver: any) => {
      if (caregiver.userId && caregiver.userId._id) {
        userIdsToNotify.push(caregiver.userId._id.toString());
      }
    });

    // Add all admin user IDs
    admins.forEach((admin: any) => {
      userIdsToNotify.push(admin._id.toString());
    });

    // Create notifications for all caregivers and admins
    if (userIdsToNotify.length > 0) {
      await notificationService.createNotification({
        userId: userIdsToNotify,
        type: 'emergency',
        title: notificationTitle,
        message: notificationMessage,
        metadata: {
          bookingId: booking._id.toString(),
          customerId: data.customerId,
          customerName: customer.name,
          customerPhone: data.phone || customer.phone,
          address: data.address,
          notes: data.notes,
          caregiverId: data.caregiverId,
        },
        sendEmail: true, // Send email notifications
      });
    }

    // Populate booking before returning
    return booking.populate([
      { path: 'customerId', select: 'name email phone' },
      { path: 'caregiverId', populate: { path: 'userId', select: 'name email phone' } },
    ]);
  }

  /**
   * Get all emergency requests (for admin/caregiver dashboard)
   */
  public async getEmergencyRequests(
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;
    
    // Find bookings with emergency-related notes or recent urgent requests
    const query = {
      status: { $in: ['requested', 'confirmed'] },
      $or: [
        { notes: /emergency/i },
        { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, // Last 24 hours
      ],
    };

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate([
          { path: 'customerId', select: 'name email phone' },
          { path: 'caregiverId', populate: { path: 'userId', select: 'name email phone' } },
        ]),
      Booking.countDocuments(query),
    ]);

    return {
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const emergencyRequestService = new EmergencyRequestService();

