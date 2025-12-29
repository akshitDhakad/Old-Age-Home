/**
 * Error handling utilities
 * Provides consistent error handling and user-friendly error messages
 */

import { ApiClientError } from '../api/client';

/**
 * Get user-friendly error message from error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Get validation errors from API error
 */
export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (error instanceof ApiClientError && error.errors) {
    return error.errors;
  }

  return null;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof ApiClientError) {
    return error.status === 0 || error.status >= 500;
  }

  return false;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof ApiClientError) {
    return error.status === 401 || error.status === 403;
  }

  return false;
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: Record<string, string[]>): string {
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n');
}


