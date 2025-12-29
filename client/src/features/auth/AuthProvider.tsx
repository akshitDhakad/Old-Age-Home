/**
 * Authentication Context Provider
 * Enhanced with session persistence, expiration handling, and optimized state management
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getCurrentUser, logout as logoutService, login as loginService, register as registerService, refreshToken } from '../../services/auth';
import {
  getCachedUser,
  cacheUser,
  clearAuthTokens,
  isAuthenticated,
  shouldRefreshToken,
  updateLastActivity,
  initializeAuthStorage,
} from '../../utils/authStorage';
import type { User } from '../../types';
import type { LoginCredentials, RegisterCredentials } from '../../services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activityIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize auth storage on mount
  useEffect(() => {
    initializeAuthStorage();
    
    // Load cached user immediately for instant UI
    const cachedUser = getCachedUser();
    if (cachedUser) {
      setUser(cachedUser);
    }
    
    setIsInitialized(true);
  }, []);

  // Check authentication status
  const isAuth = isAuthenticated();
  
  // Fetch current user from API if authenticated
  const { data: currentUser, isLoading, error, refetch } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => getCurrentUser(false), // Use cached data first
    enabled: isAuth && isInitialized,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if we have cached data
  });

  // Update user state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      cacheUser(currentUser);
    }
  }, [currentUser]);

  // Handle authentication errors
  useEffect(() => {
    if (error && !isAuth) {
      setUser(null);
      clearAuthTokens();
    }
  }, [error, isAuth]);

  // Set up token refresh interval
  useEffect(() => {
    if (!isAuth) {
      // Clear intervals if not authenticated
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    // Check if token needs refresh and set up interval
    const checkAndRefreshToken = async () => {
      if (shouldRefreshToken()) {
        try {
          await refreshToken();
          // Refetch user data after token refresh
          await refetch();
        } catch (error) {
          console.error('Token refresh failed:', error);
          setUser(null);
          clearAuthTokens();
        }
      }
    };

    // Check immediately
    checkAndRefreshToken();

    // Set up interval to check every 5 minutes
    refreshIntervalRef.current = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isAuth, refetch]);

  // Track user activity
  useEffect(() => {
    if (!isAuth) {
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
        activityIntervalRef.current = null;
      }
      return;
    }

    // Update activity on user interactions
    const updateActivity = () => {
      updateLastActivity();
    };

    // Listen to user activity events
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    // Update activity every minute
    activityIntervalRef.current = setInterval(updateActivity, 60 * 1000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
      }
    };
  }, [isAuth]);

  // Handle page visibility (refresh token when tab becomes visible)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isAuth) {
        // Check if token needs refresh
        if (shouldRefreshToken()) {
          try {
            await refreshToken();
            await refetch();
          } catch (error) {
            console.error('Token refresh on visibility change failed:', error);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuth, refetch]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: (data) => {
      setUser(data.user);
      cacheUser(data.user);
      queryClient.setQueryData(['auth', 'me'], data.user);
      // Invalidate queries to refresh data
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error('Login error:', error);
      setUser(null);
      clearAuthTokens();
      throw error;
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: registerService,
    onSuccess: (data) => {
      setUser(data.user);
      cacheUser(data.user);
      queryClient.setQueryData(['auth', 'me'], data.user);
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error('Register error:', error);
      setUser(null);
      clearAuthTokens();
      throw error;
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      setUser(null);
      clearAuthTokens();
      queryClient.clear();
      // Clear intervals
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
        activityIntervalRef.current = null;
      }
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Clear anyway
      setUser(null);
      clearAuthTokens();
      queryClient.clear();
    },
  });

  const login = useCallback(async (credentials: LoginCredentials): Promise<User> => {
    const result = await loginMutation.mutateAsync(credentials);
    return result.user;
  }, [loginMutation]);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<User> => {
    const result = await registerMutation.mutateAsync(credentials);
    return result.user;
  }, [registerMutation]);

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const value: AuthContextType = {
    user,
    isLoading: !isInitialized || isLoading || loginMutation.isPending || registerMutation.isPending,
    isAuthenticated: !!user && isAuth,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
