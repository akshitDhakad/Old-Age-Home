/**
 * Authentication Storage Utility
 * Manages authentication tokens and user data with session persistence
 */

import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearAllStorage,
  STORAGE_KEYS,
  setSessionExpiry,
  getSessionExpiry,
  updateLastActivity as updateActivity,
  SESSION_CONFIG,
} from './sessionStorage';
import type { User } from '../types';

/**
 * Token storage interface
 */
interface TokenData {
  token: string;
  refreshToken: string;
  expiresAt?: number;
}

/**
 * User data storage interface
 */
interface UserData extends User {
  cachedAt: number;
}

/**
 * Get authentication token
 */
export function getAuthToken(): string | null {
  return getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Get refresh token
 */
export function getRefreshToken(): string | null {
  return getStorageItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Store authentication tokens
 */
export function setAuthTokens(
  token: string,
  refreshToken: string,
  expiresIn?: number
): void {
  // Store tokens
  setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token, expiresIn);
  setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

  // Update session expiry
  if (expiresIn) {
    setSessionExpiry(expiresIn);
  } else {
    // Default to 7 days if no expiry provided
    setSessionExpiry(SESSION_CONFIG.SESSION_TIMEOUT);
  }

  // Update activity
  updateActivity();
}

/**
 * Clear authentication tokens
 */
export function clearAuthTokens(): void {
  removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
  removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
  removeStorageItem(STORAGE_KEYS.USER_DATA);
  removeStorageItem(STORAGE_KEYS.SESSION_EXPIRY);
  removeStorageItem(STORAGE_KEYS.LAST_ACTIVITY);
}

/**
 * Get cached user data
 */
export function getCachedUser(): User | null {
  const userData = getStorageItem<UserData>(STORAGE_KEYS.USER_DATA);
  if (!userData) return null;

  // Check if cache is stale (older than 5 minutes)
  const CACHE_MAX_AGE = 5 * 60 * 1000;
  if (Date.now() - userData.cachedAt > CACHE_MAX_AGE) {
    // Cache is stale, but return it anyway (will be refreshed)
    return userData;
  }

  return userData;
}

/**
 * Cache user data
 */
export function cacheUser(user: User): void {
  const userData: UserData = {
    ...user,
    cachedAt: Date.now(),
  };
  setStorageItem(STORAGE_KEYS.USER_DATA, userData);
  updateActivity();
}

/**
 * Clear cached user data
 */
export function clearCachedUser(): void {
  removeStorageItem(STORAGE_KEYS.USER_DATA);
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token) return false;

  // Check session expiry
  const expiry = getSessionExpiry();
  if (!expiry || Date.now() > expiry) {
    clearAuthTokens();
    return false;
  }

  return true;
}

/**
 * Get token expiration time (if available)
 */
export function getTokenExpiration(): number | null {
  const expiry = getSessionExpiry();
  return expiry;
}

/**
 * Check if token needs refresh (expiring soon)
 */
export function shouldRefreshToken(): boolean {
  const expiry = getSessionExpiry();
  if (!expiry) return false;

  const REFRESH_THRESHOLD = SESSION_CONFIG.REFRESH_THRESHOLD;
  return Date.now() > (expiry - REFRESH_THRESHOLD);
}

/**
 * Clear all authentication data
 */
export function clearAuth(): void {
  clearAuthTokens();
}

/**
 * Initialize auth storage (clear expired items on app start)
 */
export function initializeAuthStorage(): void {
  // Clear expired items
  import('./sessionStorage').then(({ clearExpiredItems }) => {
    clearExpiredItems();
  });

  // Update activity on initialization
  if (isAuthenticated()) {
    updateActivity();
  }
}

/**
 * Update last activity timestamp
 * Re-exported from sessionStorage for convenience
 */
export function updateLastActivity(): void {
  updateActivity();
}

