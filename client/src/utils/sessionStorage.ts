/**
 * Session Storage Utility
 * Enhanced localStorage/sessionStorage wrapper with expiration support
 * Uses localStorage for persistence across tabs, sessionStorage for tab-specific data
 */

const STORAGE_PREFIX = 'sanjeevani_';

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: `${STORAGE_PREFIX}auth_token`,
  REFRESH_TOKEN: `${STORAGE_PREFIX}refresh_token`,
  USER_DATA: `${STORAGE_PREFIX}user_data`,
  SESSION_EXPIRY: `${STORAGE_PREFIX}session_expiry`,
  LAST_ACTIVITY: `${STORAGE_PREFIX}last_activity`,
} as const;

/**
 * Session configuration
 */
export const SESSION_CONFIG = {
  // Session timeout: 7 days (in milliseconds)
  SESSION_TIMEOUT: 7 * 24 * 60 * 60 * 1000,
  // Token refresh threshold: refresh 5 minutes before expiry
  REFRESH_THRESHOLD: 5 * 60 * 1000,
  // Activity timeout: 30 minutes of inactivity
  ACTIVITY_TIMEOUT: 30 * 60 * 1000,
} as const;

/**
 * Storage interface
 */
interface StorageItem<T> {
  value: T;
  expiry?: number;
  timestamp: number;
}

/**
 * Get item from localStorage with expiration check
 */
export function getStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsed: StorageItem<T> = JSON.parse(item);

    // Check expiration
    if (parsed.expiry && Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.value;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

/**
 * Set item in localStorage with optional expiration
 */
export function setStorageItem<T>(
  key: string,
  value: T,
  expiryMs?: number
): void {
  try {
    const item: StorageItem<T> = {
      value,
      expiry: expiryMs ? Date.now() + expiryMs : undefined,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, clearing old items');
      clearExpiredItems();
      // Retry once
      try {
        localStorage.setItem(key, JSON.stringify({
          value,
          expiry: expiryMs ? Date.now() + expiryMs : undefined,
          timestamp: Date.now(),
        }));
      } catch (retryError) {
        console.error('Failed to save after cleanup:', retryError);
      }
    }
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
}

/**
 * Clear all expired items from localStorage
 */
export function clearExpiredItems(): void {
  try {
    const keys = Object.keys(localStorage);
    const prefix = STORAGE_PREFIX;
    
    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const parsed: StorageItem<unknown> = JSON.parse(item);
            if (parsed.expiry && Date.now() > parsed.expiry) {
              localStorage.removeItem(key);
            }
          } catch {
            // Invalid JSON, remove it
            localStorage.removeItem(key);
          }
        }
      }
    });
  } catch (error) {
    console.error('Error clearing expired items:', error);
  }
}

/**
 * Clear all app-related items from localStorage
 */
export function clearAllStorage(): void {
  try {
    const keys = Object.keys(localStorage);
    const prefix = STORAGE_PREFIX;
    
    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}

/**
 * Check if session is expired
 */
export function isSessionExpired(): boolean {
  const expiry = getStorageItem<number>(STORAGE_KEYS.SESSION_EXPIRY);
  if (!expiry) return true;
  
  return Date.now() > expiry;
}

/**
 * Check if session is about to expire (within refresh threshold)
 */
export function isSessionExpiringSoon(): boolean {
  const expiry = getStorageItem<number>(STORAGE_KEYS.SESSION_EXPIRY);
  if (!expiry) return true;
  
  return Date.now() > (expiry - SESSION_CONFIG.REFRESH_THRESHOLD);
}

/**
 * Update last activity timestamp
 */
export function updateLastActivity(): void {
  setStorageItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now());
}

/**
 * Check if user has been inactive too long
 */
export function isInactive(): boolean {
  const lastActivity = getStorageItem<number>(STORAGE_KEYS.LAST_ACTIVITY);
  if (!lastActivity) return false;
  
  return Date.now() - lastActivity > SESSION_CONFIG.ACTIVITY_TIMEOUT;
}

/**
 * Get session expiry time
 */
export function getSessionExpiry(): number | null {
  return getStorageItem<number>(STORAGE_KEYS.SESSION_EXPIRY);
}

/**
 * Set session expiry
 */
export function setSessionExpiry(expiryMs: number): void {
  setStorageItem(STORAGE_KEYS.SESSION_EXPIRY, Date.now() + expiryMs);
}

/**
 * Session storage (for tab-specific data)
 */
export const sessionStorage = {
  get: <T>(key: string): T | null => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to sessionStorage (${key}):`, error);
    }
  },
  remove: (key: string): void => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from sessionStorage (${key}):`, error);
    }
  },
  clear: (): void => {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  },
};

