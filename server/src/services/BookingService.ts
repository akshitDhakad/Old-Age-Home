/**
 * Booking service
 * Handles booking-related business logic
 */

import { Booking, IBooking } from '../models/Booking';
import { CaregiverProfile } from '../models/CaregiverProfile';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors/AppError';

export interface CreateBookingData {
  customerId: string;
  caregiverId: string;
  startTime: Date;
  endTime?: Date;
  address: string;
  notes?: string;
}

export interface UpdateBookingData {
  status?: 'requested' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  endTime?: Date;
  notes?: string;
}

export class BookingService {
  /**
   * Create a new booking
   */
  public async createBooking(data: CreateBookingData): Promise<IBooking> {
    // Verify caregiver exists and is verified
    const caregiver = await CaregiverProfile.findById(data.caregiverId).populate('userId');
    if (!caregiver) {
      throw new NotFoundError('Caregiver not found');
    }
    if (!caregiver.verified) {
      throw new BadRequestError('Caregiver is not verified');
    }

    // Calculate price based on hourly rate and duration
    const durationHours = data.endTime
      ? (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60 * 60)
      : 1; // Default to 1 hour if no end time

    const priceCents = Math.round((caregiver.hourlyRate || 0) * durationHours * 100);

    const booking = await Booking.create({
      customerId: data.customerId,
      caregiverId: data.caregiverId,
      startTime: data.startTime,
      endTime: data.endTime,
      address: data.address,
      notes: data.notes,
      priceCents,
      status: 'requested',
    });

    return booking.populate([
      { path: 'customerId', select: 'name email phone' },
      { path: 'caregiverId', populate: { path: 'userId', select: 'name email phone' } },
    ]);
  }

  /**
   * Get booking by ID
   */
  public async getBookingById(bookingId: string): Promise<IBooking> {
    const booking = await Booking.findById(bookingId).populate([
      { path: 'customerId', select: 'name email phone' },
      { path: 'caregiverId', populate: { path: 'userId', select: 'name email phone' } },
    ]);

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    return booking;
  }

  /**
   * Get bookings for a user
   */
  public async getUserBookings(
    userId: string,
    role: 'customer' | 'caregiver',
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;
    const query: any = role === 'customer' ? { customerId: userId } : { caregiverId: userId };

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

  /**
   * Update booking
   */
  public async updateBooking(
    bookingId: string,
    userId: string,
    userRole: string,
    data: UpdateBookingData
  ): Promise<IBooking> {
    const booking = await this.getBookingById(bookingId);

    // Authorization check
    const isOwner =
      booking.customerId.toString() === userId ||
      (booking.caregiverId && booking.caregiverId.toString() === userId);
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('Not authorized to update this booking');
    }

    // Status transition validation
    if (data.status) {
      const validTransitions: Record<string, string[]> = {
        requested: ['confirmed', 'cancelled'],
        confirmed: ['in_progress', 'cancelled'],
        in_progress: ['completed', 'cancelled'],
        completed: [],
        cancelled: [],
      };

      const allowedStatuses = validTransitions[booking.status] || [];
      if (!allowedStatuses.includes(data.status)) {
        throw new BadRequestError(
          `Cannot transition from ${booking.status} to ${data.status}`
        );
      }
    }

    if (data.status) booking.status = data.status;
    if (data.endTime) booking.endTime = data.endTime;
    if (data.notes !== undefined) booking.notes = data.notes;

    await booking.save();
    return booking;
  }

  /**
   * Cancel booking
   */
  public async cancelBooking(bookingId: string, userId: string): Promise<IBooking> {
    const booking = await this.getBookingById(bookingId);

    if (booking.customerId.toString() !== userId) {
      throw new ForbiddenError('Only the customer can cancel this booking');
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      throw new BadRequestError('Cannot cancel a completed or already cancelled booking');
    }

    booking.status = 'cancelled';
    await booking.save();
    return booking;
  }
}

export const bookingService = new BookingService();


