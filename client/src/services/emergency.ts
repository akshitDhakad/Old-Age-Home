/**
 * Emergency Request Service
 * Handles emergency care requests
 */

import { apiPost, apiGet } from '../api/client';
import type { Booking } from '../types';

export interface CreateEmergencyRequestData {
  caregiverId?: string;
  address: string;
  notes?: string;
  phone?: string;
}

/**
 * Create emergency request
 */
export async function createEmergencyRequest(
  data: CreateEmergencyRequestData
): Promise<Booking> {
  return apiPost<Booking>('/emergency', data);
}

/**
 * Get emergency requests (for admins and caregivers)
 */
export async function getEmergencyRequests(params?: {
  page?: number;
  limit?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.limit) queryParams.set('limit', String(params.limit));

  const queryString = queryParams.toString();
  return apiGet<{
    data: Booking[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/emergency${queryString ? `?${queryString}` : ''}`);
}

