/**
 * Application Router
 * Handles all route definitions and protected routes
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
import { LandingPage } from '../pages/index';
import { CustomerDashboard } from '../pages/dashboard/CustomerDashboard';
import { CaregiverDashboard } from '../pages/dashboard/CaregiverDashboard';
import { AdminPanel } from '../pages/dashboard/AdminPanel';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import CaregiverOnboardWizard from '../features/onboarding/CaregiverOnboardWizard';
import type { Role } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Customer Routes */}
        {/* <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        /> */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />

        {/* Protected Caregiver Routes */}
        <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
        {/* <Route
          path="/caregiver/dashboard"
          element={
            <ProtectedRoute allowedRoles={['caregiver']}>
              <CaregiverDashboard />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/caregiver/onboarding"
          element={<CaregiverOnboardWizard />}
        />
        {/* <Route
          path="/caregiver/onboarding"
          element={
            <ProtectedRoute allowedRoles={['caregiver']}>
              <CaregiverOnboardWizard />
            </ProtectedRoute>
          }
        /> */}

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminPanel />} />
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        /> */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
