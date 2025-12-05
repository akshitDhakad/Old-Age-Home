/**
 * MSW Request Handlers
 * Mock API responses for development and testing
 */

import { http, HttpResponse } from 'msw';
import type {
  User,
  CaregiverProfile,
  Booking,
  Subscription,
  AdminReport,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

// Mock data storage
let mockUsers: User[] = [
  {
    id: '1',
    role: 'customer',
    name: 'John Doe',
    email: 'customer@example.com',
    phone: '+1234567890',
    city: 'New York',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    role: 'caregiver',
    name: 'Jane Smith',
    email: 'caregiver@example.com',
    phone: '+1234567891',
    city: 'New York',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    role: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let mockCaregivers: CaregiverProfile[] = [
  {
    id: 'c1',
    userId: '2',
    services: ['nursing', 'physiotherapy'],
    experienceYears: 5,
    verified: true,
    verificationStatus: 'verified',
    documents: [],
    rating: 4.8,
    hourlyRate: 2500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let mockBookings: Booking[] = [];
let mockSubscriptions: Subscription[] = [];

export const handlers = [
  // Auth endpoints
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = mockUsers.find((u) => u.email === body.email);

    if (!user || body.password !== 'password') {
      return HttpResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      token: `mock-token-${user.id}`,
      user,
    });
  }),

  http.post(`${BASE_URL}/auth/logout`, () => {
    return HttpResponse.json({ message: 'Logged out' });
  }),

  http.get(`${BASE_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = token.replace('mock-token-', '');
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return HttpResponse.json({ user });
  }),

  // Caregiver endpoints
  http.get(`${BASE_URL}/caregivers`, ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get('city');
    const service = url.searchParams.get('service');

    let filtered = [...mockCaregivers];

    if (city) {
      filtered = filtered.filter((c) => {
        const user = mockUsers.find((u) => u.id === c.userId);
        return user?.city === city;
      });
    }

    if (service) {
      filtered = filtered.filter((c) => c.services.includes(service));
    }

    return HttpResponse.json({
      data: filtered,
      pagination: {
        page: 1,
        limit: 10,
        total: filtered.length,
        totalPages: 1,
      },
    });
  }),

  http.get(`${BASE_URL}/caregivers/:id`, ({ params }) => {
    const caregiver = mockCaregivers.find((c) => c.id === params.id);
    if (!caregiver) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ data: caregiver });
  }),

  http.get(`${BASE_URL}/caregivers/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = token.replace('mock-token-', '');
    const caregiver = mockCaregivers.find((c) => c.userId === userId);

    if (!caregiver) {
      return HttpResponse.json(
        { message: 'Profile not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(caregiver);
  }),

  http.post(`${BASE_URL}/caregivers`, async ({ request }) => {
    const body = (await request.json()) as Partial<CaregiverProfile>;
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = token.replace('mock-token-', '');

    const newCaregiver: CaregiverProfile = {
      id: `c${mockCaregivers.length + 1}`,
      userId,
      services: body.services || [],
      experienceYears: body.experienceYears || 0,
      verified: false,
      verificationStatus: 'pending',
      documents: [],
      hourlyRate: body.hourlyRate,
      bio: body.bio,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockCaregivers.push(newCaregiver);
    return HttpResponse.json(newCaregiver, { status: 201 });
  }),

  http.post(`${BASE_URL}/caregivers/:id/documents`, async () => {
    // Mock document upload
    return HttpResponse.json({
      type: 'id_proof',
      url: 'https://example.com/documents/mock-doc.pdf',
      uploadedAt: new Date().toISOString(),
      verified: false,
    });
  }),

  // Booking endpoints
  http.get(`${BASE_URL}/bookings`, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    let filtered = [...mockBookings];
    if (userId) {
      filtered = filtered.filter((b) => b.customerId === userId);
    }

    return HttpResponse.json({
      data: filtered,
      pagination: {
        page: 1,
        limit: 10,
        total: filtered.length,
        totalPages: 1,
      },
    });
  }),

  http.post(`${BASE_URL}/bookings`, async ({ request }) => {
    const body = (await request.json()) as Partial<Booking>;
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = token.replace('mock-token-', '');

    const newBooking: Booking = {
      id: `b${mockBookings.length + 1}`,
      customerId: userId,
      caregiverId: body.caregiverId,
      startTime: body.startTime || new Date().toISOString(),
      endTime: body.endTime,
      status: 'requested',
      priceCents: body.priceCents || 0,
      address: body.address || '',
      notes: body.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockBookings.push(newBooking);
    return HttpResponse.json(newBooking, { status: 201 });
  }),

  // Subscription endpoints
  http.get(`${BASE_URL}/subscriptions`, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    let filtered = [...mockSubscriptions];
    if (userId) {
      filtered = filtered.filter((s) => s.userId === userId);
    }

    return HttpResponse.json({ data: filtered });
  }),

  // Verification endpoints
  http.post(`${BASE_URL}/verification/request`, async ({ request }) => {
    const body = (await request.json()) as { userId: string; type: string };
    return HttpResponse.json({
      id: 'v1',
      userId: body.userId,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    });
  }),

  // Admin endpoints
  http.get(`${BASE_URL}/admin/reports`, () => {
    const report: AdminReport = {
      totalUsers: mockUsers.length,
      totalCaregivers: mockCaregivers.length,
      totalBookings: mockBookings.length,
      activeSubscriptions: mockSubscriptions.filter(
        (s) => s.status === 'active'
      ).length,
      revenueCents: mockBookings.reduce((sum, b) => sum + b.priceCents, 0),
      period: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      },
    };
    return HttpResponse.json(report);
  }),

  http.get(`${BASE_URL}/admin/verifications/pending`, () => {
    const pending = mockCaregivers.filter(
      (c) => c.verificationStatus === 'pending'
    );
    return HttpResponse.json({ data: pending });
  }),

  http.get(`${BASE_URL}/admin/users`, () => {
    return HttpResponse.json({
      data: mockUsers.slice(0, 10),
      total: mockUsers.length,
    });
  }),

  // Payment endpoints (mock)
  http.post(`${BASE_URL}/payments/checkout`, async ({ request }) => {
    const body = (await request.json()) as { amount_cents: number };
    return HttpResponse.json({
      id: 'ps_123',
      amountCents: body.amount_cents || 0,
      currency: 'usd',
      status: 'pending',
      clientSecret: 'mock_client_secret',
      createdAt: new Date().toISOString(),
    });
  }),
];
