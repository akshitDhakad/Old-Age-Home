/**
 * Authentication service
 * Handles login, logout, token management
 */

import { apiPost, apiGet } from '../api/client';
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
  role?: 'customer' | 'caregiver';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthResponse {
  user: User;
}

/**
 * Register a new user
 * NOTE: In production, backend should set httpOnly cookie instead of returning token
 */
export async function register(credentials: RegisterCredentials): Promise<LoginResponse> {
  const response = await apiPost<LoginResponse>('/auth/register', credentials);

  // Store token temporarily (replace with httpOnly cookie in production)
  if (response.token) {
    localStorage.setItem('auth_token', response.token);
  }

  return response;
}

/**
 * Login user and store token
 * NOTE: In production, backend should set httpOnly cookie instead of returning token
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiPost<LoginResponse>('/auth/login', credentials);

  // Store token temporarily (replace with httpOnly cookie in production)
  if (response.token) {
    localStorage.setItem('auth_token', response.token);
  }

  return response;
}

/**
 * Logout user and clear token
 */
export async function logout(): Promise<void> {
  try {
    await apiPost('/auth/logout');
  } catch (error) {
    // Continue with logout even if API call fails
    console.error('Logout API error:', error);
  } finally {
    localStorage.removeItem('auth_token');
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User> {
  const response = await apiGet<AuthResponse>('/auth/me');
  return response.user;
}

/**
 * Refresh authentication token
 * NOTE: Implement token refresh logic based on backend strategy
 */
export async function refreshToken(): Promise<string> {
  const response = await apiPost<{ token: string }>('/auth/refresh');
  if (response.token) {
    localStorage.setItem('auth_token', response.token);
  }
  return response.token;
}

