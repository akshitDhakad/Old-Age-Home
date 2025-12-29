/**
 * Authentication service
 * Handles login, logout, token management with backend integration
 * Enhanced with session persistence and expiration handling
 */

import { apiPost, apiGet } from '../api/client';
import {
  setAuthTokens,
  clearAuthTokens,
  cacheUser,
  clearCachedUser,
  getCachedUser,
} from '../utils/authStorage';
import type { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'customer' | 'caregiver' | 'vendor';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

/**
 * Register a new user
 */
export async function register(credentials: RegisterCredentials): Promise<LoginResponse> {
  const response = await apiPost<AuthResponse>('/auth/register', credentials);

  // Store tokens and cache user data
  if (response.token) {
    // Calculate token expiration (default 7 days, adjust based on backend)
    const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    setAuthTokens(response.token, response.refreshToken, expiresIn);
    cacheUser(response.user);
  }

  return {
    user: response.user,
    token: response.token,
    refreshToken: response.refreshToken,
  };
}

/**
 * Login user and store tokens
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiPost<AuthResponse>('/auth/login', credentials);

  // Store tokens and cache user data
  if (response.token) {
    // Calculate token expiration (default 7 days, adjust based on backend)
    const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    setAuthTokens(response.token, response.refreshToken, expiresIn);
    cacheUser(response.user);
  }

  return {
    user: response.user,
    token: response.token,
    refreshToken: response.refreshToken,
  };
}

/**
 * Logout user and clear tokens
 */
export async function logout(): Promise<void> {
  try {
    // Optionally call backend logout endpoint if available
    // await apiPost('/auth/logout');
  } catch (error) {
    // Continue with logout even if API call fails
    console.error('Logout API error:', error);
  } finally {
    clearAuthTokens();
    clearCachedUser();
  }
}

/**
 * Get current authenticated user
 * Uses cached data if available and fresh, otherwise fetches from API
 */
export async function getCurrentUser(forceRefresh = false): Promise<User> {
  // Return cached user if available and not forcing refresh
  if (!forceRefresh) {
    const cachedUser = getCachedUser();
    if (cachedUser) {
      return cachedUser;
    }
  }

  // Fetch from API
  const response = await apiGet<{ user: User }>('/auth/me');
  
  // Cache the user data
  cacheUser(response.user);
  
  return response.user;
}

/**
 * Refresh authentication token
 * Enhanced with expiration tracking
 */
export async function refreshToken(): Promise<string> {
  const { getRefreshToken } = await import('../utils/authStorage');
  const refreshTokenValue = getRefreshToken();
  
  if (!refreshTokenValue) {
    throw new Error('No refresh token available');
  }

  const response = await apiPost<{ token: string }>('/auth/refresh-token', {
    refreshToken: refreshTokenValue,
  });

  if (response.token) {
    // Update tokens with new expiration
    const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days
    setAuthTokens(response.token, refreshTokenValue, expiresIn);
  }

  return response.token;
}
