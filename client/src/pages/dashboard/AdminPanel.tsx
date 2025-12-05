/**
 * Admin Panel Page
 * Admin dashboard for user verification, reports, and platform management
 */

import { useQuery } from '@tanstack/react-query';
import {
  getAdminReports,
  getPendingVerifications,
  getUsers,
} from '../../services/admin';
import { Card, Spinner, Button, DecorativeDoodles } from '../../components';
import { useAuth } from '../../features/auth/useAuth';

export function AdminPanel() {
  const { user } = useAuth();

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['admin', 'reports'],
    queryFn: () => getAdminReports(),
  });

  const { data: pendingVerifications, isLoading: verificationsLoading } =
    useQuery({
      queryKey: ['admin', 'verifications', 'pending'],
      queryFn: getPendingVerifications,
    });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => getUsers({ limit: 10 }),
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <p className="text-red-600">Access denied. Admin privileges required.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <DecorativeDoodles variant="light" density="low" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">
            Manage users, verifications, and view platform analytics.
          </p>
        </div>

        {/* Reports */}
        {reportsLoading ? (
          <div className="flex justify-center p-8">
            <Spinner size="lg" />
          </div>
        ) : reports ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.totalUsers}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600">Caregivers</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.totalCaregivers}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.totalBookings}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(reports.revenueCents / 100).toFixed(2)}
              </p>
            </Card>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Verifications */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pending Verifications
            </h2>
            {verificationsLoading ? (
              <div className="flex justify-center p-8">
                <Spinner />
              </div>
            ) : pendingVerifications && pendingVerifications.length > 0 ? (
              <div className="space-y-3">
                {pendingVerifications.map((profile) => (
                  <div
                    key={profile.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Profile #{profile.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Services: {profile.services.join(', ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Experience: {profile.experienceYears} years
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="primary">
                          Approve
                        </Button>
                        <Button size="sm" variant="danger">
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                No pending verifications.
              </p>
            )}
          </Card>

          {/* Recent Users */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Users
            </h2>
            {usersLoading ? (
              <div className="flex justify-center p-8">
                <Spinner />
              </div>
            ) : usersData && usersData.data.length > 0 ? (
              <div className="space-y-3">
                {usersData.data.map((userItem) => (
                  <div
                    key={userItem.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {userItem.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {userItem.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {userItem.role}
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No users found.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
