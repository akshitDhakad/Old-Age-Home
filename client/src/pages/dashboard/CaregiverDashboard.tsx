/**
 * Caregiver Dashboard Page
 * Main dashboard for caregivers to manage jobs, profile, and availability
 */

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getMyCaregiverProfile } from '../../services/caregivers';
import { getBookings } from '../../services/bookings';
import { useAuth } from '../../features/auth/useAuth';
import { Card, Button, Spinner, DecorativeDoodles } from '../../components';
import { VerificationStatus } from '../../features/onboarding/steps/VerificationStatus';

export function CaregiverDashboard() {
  const { user } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['caregiver', 'me'],
    queryFn: getMyCaregiverProfile,
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings', 'caregiver', user?.id],
    queryFn: () =>
      getBookings({
        userId: user?.id,
      }),
    enabled: !!user?.id,
  });

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const bookings = bookingsData?.data || [];
  const pendingBookings = bookings.filter((b) => b.status === 'requested');
  const activeBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'in_progress'
  );

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <DecorativeDoodles variant="light" density="low" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Caregiver Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your profile, availability, and bookings.
          </p>
        </div>

        {!profile && (
          <Card className="mb-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Complete Your Profile
              </h2>
              <p className="text-gray-600 mb-4">
                Set up your caregiver profile to start receiving bookings.
              </p>
              <Link to="/caregiver/onboarding">
                <Button>Start Onboarding</Button>
              </Link>
            </div>
          </Card>
        )}

        {profile && (
          <>
            {/* Verification Status */}
            {profile.verificationStatus !== 'verified' && (
              <Card className="mb-6">
                <VerificationStatus status={profile.verificationStatus} />
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {pendingBookings.length}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Pending Requests
                      </p>
                    </div>
                  </Card>
                  <Card>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {activeBookings.length}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Active Bookings
                      </p>
                    </div>
                  </Card>
                  <Card>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {bookings.filter((b) => b.status === 'completed').length}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Completed
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Recent Bookings */}
                <Card>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Recent Bookings
                  </h2>
                  {bookingsLoading ? (
                    <div className="flex justify-center p-8">
                      <Spinner />
                    </div>
                  ) : bookings.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">
                      No bookings yet. Your bookings will appear here.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map((booking) => (
                        <div
                          key={booking.id}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-900">
                                Booking #{booking.id.slice(0, 8)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {booking.address}
                              </p>
                              <p className="text-sm text-gray-600">
                                Status: {booking.status}
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Profile Summary */}
                <Card>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Profile Summary
                  </h2>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Services:</strong> {profile.services.join(', ')}
                    </p>
                    <p>
                      <strong>Experience:</strong> {profile.experienceYears}{' '}
                      years
                    </p>
                    {profile.rating && (
                      <p>
                        <strong>Rating:</strong> {profile.rating.toFixed(1)} ⭐
                      </p>
                    )}
                    {profile.hourlyRate && (
                      <p>
                        <strong>Rate:</strong> $
                        {(profile.hourlyRate / 100).toFixed(2)}/hr
                      </p>
                    )}
                  </div>
                  <Button fullWidth variant="outline" className="mt-4">
                    Edit Profile
                  </Button>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="space-y-2">
                    <Button fullWidth variant="outline">
                      Update Availability
                    </Button>
                    <Button fullWidth variant="outline">
                      View Earnings
                    </Button>
                    <Button fullWidth variant="outline">
                      Upload Documents
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

