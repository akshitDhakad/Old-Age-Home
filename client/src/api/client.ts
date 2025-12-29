/**
 * Typed API client wrapper
 * Uses fetch with proper error handling, type safety, and token refresh
 * Enhanced with session persistence and expiration handling
 *
 * NOTE: In production, use httpOnly cookies for JWT tokens instead of localStorage
 * This requires backend support for SameSite cookie attributes
 */

import { getAuthToken as getToken, getRefreshToken as getRefresh, setAuthTokens, clearAuthTokens } from '../utils/authStorage';

const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
const API_VERSION = '/api/v1';

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ApiClientError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Get auth token from storage
 * Uses authStorage utility for consistent token management
 */
function getAuthToken(): string | null {
  return getToken();
}

/**
 * Get refresh token from storage
 */
function getRefreshToken(): string | null {
  return getRefresh();
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}${API_VERSION}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearAuthTokens();
      return null;
    }

    const result = await response.json();
    if (result.success && result.data?.token) {
      const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days
      setAuthTokens(result.data.token, refreshToken, expiresIn);
      return result.data.token;
    }

    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearAuthTokens();
    return null;
  }
}

/**
 * Typed fetch wrapper with error handling and token refresh
 */
export async function apiFetch<T>(
  path: string,
  opts?: RequestInit
): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${API_VERSION}${path}`;

  // Get auth token
  let token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts?.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response = await fetch(url, {
    credentials: 'include',
    ...opts,
    headers,
  });

  // If unauthorized, try to refresh token
  if (response.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry request with new token
      headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(url, {
        credentials: 'include',
        ...opts,
        headers,
      });
    } else {
      // Refresh failed, clear tokens and throw error
      clearAuthTokens();
      throw new ApiClientError('Session expired. Please login again.', 401);
    }
  }

  if (!response.ok) {
    let errorMessage = `API ${response.status} ${response.statusText}`;
    let errors: Record<string, string[]> | undefined;

    try {
      const errorData = await response.json();
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
      errors = errorData.error?.errors || errorData.errors;
    } catch {
      // If response is not JSON, use default error message
      const text = await response.text();
      if (text) errorMessage = text;
    }

    throw new ApiClientError(errorMessage, response.status, errors);
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return {} as T;
  }

  const result = await response.json();
  
  // Handle backend response format { success: boolean, data: T }
  if (result.success !== undefined && 'data' in result) {
    // Return data even if it's null (valid state for missing resources)
    return result.data as T;
  }

  return result as T;
}

/**
 * GET request helper
 */
export function apiGet<T>(path: string, opts?: RequestInit): Promise<T> {
  return apiFetch<T>(path, { ...opts, method: 'GET' });
}

/**
 * POST request helper
 */
export function apiPost<T>(
  path: string,
  body?: unknown,
  opts?: RequestInit
): Promise<T> {
  // Handle FormData (for file uploads)
  const isFormData = body instanceof FormData;
  const headers: Record<string, string> = isFormData
    ? {}
    : { 'Content-Type': 'application/json' };

  return apiFetch<T>(
    path,
    {
      ...opts,
      method: 'POST',
      headers: {
        ...headers,
        ...(opts?.headers as Record<string, string>),
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    }
  );
}

/**
 * PATCH request helper
 */
export function apiPatch<T>(
  path: string,
  body?: unknown,
  opts?: RequestInit
): Promise<T> {
  return apiFetch<T>(path, {
    ...opts,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT request helper
 */
export function apiPut<T>(
  path: string,
  body?: unknown,
  opts?: RequestInit
): Promise<T> {
  return apiFetch<T>(path, {
    ...opts,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request helper
 */
export function apiDelete<T>(path: string, opts?: RequestInit): Promise<T> {
  return apiFetch<T>(path, { ...opts, method: 'DELETE' });
}

// Token management is now handled by authStorage utility
// Export getAuthToken for backward compatibility
export { getAuthToken };
