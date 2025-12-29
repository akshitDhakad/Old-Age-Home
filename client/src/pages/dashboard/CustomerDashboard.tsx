/**
 * Customer Dashboard Page
 * Professional dashboard for customers to manage care, health monitoring, and caregivers
 * Integrated with real-time data and health monitoring
 */

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getCaregivers } from '../../services/caregivers';
import { useBookings } from '../../hooks/useBookings';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../features/auth/useAuth';
import {
  Card,
  Input,
  Button,
  Select,
  Spinner,
  DashboardLayout,
  ProfileSection,
  ProfileModal,
  QuickActions,
  UpcomingSchedule,
  ScheduleAppointmentModal,
  EmergencyRequest,
  HealthRecordsSection,
  AllBookingsSection,
} from '../../components';
import {
  formatTime,
  formatDateTime,
  getTimeUntil,
  formatCurrency,
  getRelativeTime,
} from '../../utils/formatDate';
import { parseISO, isToday, differenceInHours } from 'date-fns';
import type { CaregiverProfile } from '../../types';

export function CustomerDashboard() {
  const { user } = useAuth();
  const [searchCity, setSearchCity] = useState('');
  const [searchService, setSearchService] = useState('');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'health' | 'caregivers' | 'schedule' | 'bookings'
  >('overview');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const debouncedCity = useDebounce(searchCity, 500);

  // Fetch bookings
  const { data: bookingsData, isLoading: bookingsLoading } = useBookings({
    page: 1,
    limit: 50,
  });

  // Fetch caregivers
  const { data: caregiversData, isLoading: caregiversLoading } = useQuery({
    queryKey: ['caregivers', debouncedCity, searchService],
    queryFn: () =>
      getCaregivers({
        city: debouncedCity || undefined,
        service: searchService || undefined,
        page: 1,
        limit: 10,
      }),
    enabled: activeTab === 'caregivers',
  });

  // Calculate real metrics from bookings
  const metrics = useMemo(() => {
    const bookings = bookingsData?.data || [];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Active care hours this month
    const monthlyBookings = bookings.filter((b) => {
      if (!b || !b.startTime) return false;
      const bookingDate = parseISO(b.startTime);
      return bookingDate >= startOfMonth && b.status !== 'cancelled';
    });

    const activeHours = monthlyBookings.reduce((total, booking) => {
      if (booking.endTime) {
        const start = parseISO(booking.startTime);
        const end = parseISO(booking.endTime);
        return total + differenceInHours(end, start);
      }
      return total + 1; // Default 1 hour if no end time
    }, 0);

    // Next appointment
    const upcomingBookings = bookings
      .filter((b) => {
        if (!b || !b.startTime) return false;
        const bookingDate = parseISO(b.startTime);
        return (
          bookingDate >= now && ['requested', 'confirmed'].includes(b.status)
        );
      })
      .sort(
        (a, b) =>
          parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime()
      );

    const nextAppointment = upcomingBookings[0] || null;

    // Today's bookings
    const todayBookings = bookings.filter((b) => {
      if (!b || !b.startTime) return false;
      const bookingDate = parseISO(b.startTime);
      return isToday(bookingDate) && b.status !== 'cancelled';
    });

    // Completed bookings
    const completedBookings = bookings.filter(
      (b) => b && b.status === 'completed'
    );

    // Total spent this month
    const monthlySpent = monthlyBookings.reduce(
      (total, b) => total + (b.priceCents || 0),
      0
    );

    return {
      activeHours: activeHours.toFixed(1),
      nextAppointment,
      todayBookings: todayBookings || [],
      completedBookings: completedBookings.length,
      monthlySpent,
      totalBookings: bookings.length,
    };
  }, [bookingsData]);

  // Get caregiver name helper
  const getCaregiverName = (caregiver: CaregiverProfile): string => {
    if (typeof caregiver.userId === 'object' && caregiver.userId !== null) {
      return (caregiver.userId as any).name || 'Unknown';
    }
    return 'Unknown';
  };

  // Get caregiver user object helper
  const getCaregiverUser = (caregiver: CaregiverProfile): any => {
    if (typeof caregiver.userId === 'object' && caregiver.userId !== null) {
      return caregiver.userId;
    }
    return null;
  };

  // Sidebar navigation items
  const sidebarItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      onClick: () => setActiveTab('overview'),
      active: activeTab === 'overview',
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      onClick: () => setIsProfileModalOpen(true),
      active: false,
    },
    {
      id: 'health',
      label: 'Health Monitoring',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      onClick: () => setActiveTab('health'),
      active: activeTab === 'health',
    },
    {
      id: 'caregivers',
      label: 'Find Caregivers',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      onClick: () => setActiveTab('caregivers'),
      active: activeTab === 'caregivers',
    },
    {
      id: 'schedule',
      label: 'Care Schedule',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      onClick: () => setActiveTab('schedule'),
      active: activeTab === 'schedule',
    },
    {
      id: 'bookings',
      label: 'All Bookings',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      onClick: () => setActiveTab('bookings'),
      active: activeTab === 'bookings',
    },
    {
      id: 'schedule-appointment',
      label: 'Schedule Appointment',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
      onClick: () => setIsScheduleModalOpen(true),
      active: false,
    },
    {
      id: 'emergency',
      label: 'Emergency Request',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      onClick: () => setIsEmergencyModalOpen(true),
      active: false,
    },
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      title={`Welcome back, ${user?.name || 'Customer'}!`}
    >
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-primary-100 text-sm font-medium">
                        Active Care Hours
                      </p>
                      <p className="text-3xl font-bold mt-2">
                        {metrics.activeHours}
                      </p>
                      <p className="text-primary-100 text-xs mt-1">
                        This month
                      </p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-green-100 text-sm font-medium">
                        Completed Sessions
                      </p>
                      <p className="text-3xl font-bold mt-2">
                        {metrics.completedBookings}
                      </p>
                      <p className="text-green-100 text-xs mt-1">
                        Total bookings
                      </p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">
                        Next Appointment
                      </p>
                      {metrics.nextAppointment ? (
                        <>
                          <p className="text-2xl font-bold mt-2">
                            {getTimeUntil(metrics.nextAppointment.startTime)}
                          </p>
                          <p className="text-blue-100 text-xs mt-1">
                            {formatTime(metrics.nextAppointment.startTime)}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-2xl font-bold mt-2">None</p>
                          <p className="text-blue-100 text-xs mt-1">
                            No upcoming bookings
                          </p>
                        </>
                      )}
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Today's Schedule */}
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Today's Schedule
                  </h2>
                  <Link to="/bookings">
                    <Button size="sm" variant="outline">
                      View All
                    </Button>
                  </Link>
                </div>
                {bookingsLoading ? (
                  <div className="flex justify-center p-8">
                    <Spinner />
                  </div>
                ) : !metrics.todayBookings ||
                  metrics.todayBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      No bookings scheduled for today
                    </p>
                    <Link to="/bookings/new">
                      <Button size="sm" className="mt-4">
                        Schedule Appointment
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(metrics.todayBookings || []).map((booking) => {
                      const bookingId = (booking as any)._id || booking.id;
                      const startTime = parseISO(booking.startTime);
                      const statusColors = {
                        requested: 'bg-yellow-50 border-yellow-200',
                        confirmed: 'bg-blue-50 border-blue-200',
                        in_progress: 'bg-green-50 border-green-200',
                        completed: 'bg-gray-50 border-gray-200',
                        cancelled: 'bg-red-50 border-red-200',
                      };

                      return (
                        <div
                          key={bookingId}
                          className={`flex gap-4 p-4 rounded-lg border ${
                            statusColors[booking.status] ||
                            'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="text-center min-w-[60px]">
                            <p className="text-2xl font-bold text-primary-600">
                              {formatTime(startTime).split(' ')[0]}
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatTime(startTime).split(' ')[1]}
                            </p>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {booking.notes || 'Care Session'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {booking.address}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className={`text-xs px-2 py-1 rounded font-medium ${
                                  booking.status === 'confirmed'
                                    ? 'bg-blue-100 text-blue-700'
                                    : booking.status === 'in_progress'
                                      ? 'bg-green-100 text-green-700'
                                      : booking.status === 'completed'
                                        ? 'bg-gray-100 text-gray-700'
                                        : booking.status === 'cancelled'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {booking.status.replace('_', ' ').toUpperCase()}
                              </span>
                              {booking.priceCents > 0 && (
                                <span className="text-xs text-gray-600">
                                  {formatCurrency(booking.priceCents)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {booking.status === 'confirmed' && (
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>

              {/* Recent Bookings */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Bookings
                </h2>
                {bookingsLoading ? (
                  <div className="flex justify-center p-8">
                    <Spinner />
                  </div>
                ) : !bookingsData?.data || bookingsData.data.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No bookings yet</p>
                    <Link to="/bookings/new">
                      <Button size="sm" className="mt-4">
                        Create Booking
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(bookingsData?.data || []).slice(0, 5).map((booking) => {
                      const bookingId = (booking as any)._id || booking.id;
                      return (
                        <div
                          key={bookingId}
                          className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
                        >
                          <div
                            className={`p-2 rounded-lg ${
                              booking.status === 'completed'
                                ? 'bg-green-100'
                                : booking.status === 'cancelled'
                                  ? 'bg-red-100'
                                  : booking.status === 'in_progress'
                                    ? 'bg-blue-100'
                                    : 'bg-yellow-100'
                            }`}
                          >
                            <svg
                              className={`w-5 h-5 ${
                                booking.status === 'completed'
                                  ? 'text-green-600'
                                  : booking.status === 'cancelled'
                                    ? 'text-red-600'
                                    : booking.status === 'in_progress'
                                      ? 'text-blue-600'
                                      : 'text-yellow-600'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              Booking #{bookingId.slice(0, 8)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDateTime(booking.startTime)} •{' '}
                              {booking.address}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {getRelativeTime(booking.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(booking.priceCents)}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {booking.status.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-4 space-y-6">
                {/* Profile Section */}
                <ProfileSection />

                {/* Quick Stats */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Total Bookings</span>
                        <span className="font-semibold text-gray-900">
                          {metrics.totalBookings}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Monthly Spending</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(metrics.monthlySpent)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Active Caregivers */}
                {bookingsData?.data && bookingsData.data.length > 0 && (
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Active Caregivers
                    </h3>
                    <div className="space-y-3">
                      {Array.from(
                        new Set(
                          (bookingsData?.data || [])
                            .filter(
                              (b) =>
                                b && b.caregiverId && b.status !== 'cancelled'
                            )
                            .map((b) => {
                              if (
                                typeof b.caregiverId === 'object' &&
                                b.caregiverId !== null
                              ) {
                                const caregiver = b.caregiverId as any;
                                const user = caregiver.userId || caregiver;
                                return typeof user === 'object'
                                  ? user.name
                                  : 'Unknown';
                              }
                              return 'Unknown';
                            })
                        )
                      )
                        .slice(0, 3)
                        .map((name, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-700 font-semibold text-sm">
                                {name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">
                                {name}
                              </p>
                              <p className="text-xs text-gray-600">
                                Active Caregiver
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Card>
                )}

                {/* Quick Actions */}
                <QuickActions />
              </div>
            </div>
          </div>
        )}

        {/* Health Monitoring Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <HealthRecordsSection />
          </div>
        )}

        {/* Caregivers Tab */}
        {activeTab === 'caregivers' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Find Caregivers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="City"
                  placeholder="Enter city name"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
                <Select
                  label="Service"
                  options={[
                    { value: '', label: 'All Services' },
                    { value: 'nursing', label: 'Nursing Care' },
                    { value: 'physiotherapy', label: 'Physiotherapy' },
                    { value: 'adl', label: 'ADL' },
                    { value: 'companionship', label: 'Companionship' },
                    { value: 'medication', label: 'Medication Management' },
                  ]}
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                />
              </div>

              {caregiversLoading ? (
                <div className="flex justify-center p-8">
                  <Spinner />
                </div>
              ) : !caregiversData?.data || caregiversData.data.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    No caregivers found. Try adjusting your search filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(caregiversData?.data || []).map((caregiver) => {
                    const caregiverId = (caregiver as any)._id || caregiver.id;
                    const caregiverUser = getCaregiverUser(caregiver);
                    const caregiverName = getCaregiverName(caregiver);
                    const initials = caregiverName
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <div
                        key={caregiverId}
                        className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-primary-200 transition-all duration-200"
                      >
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-700 font-bold text-xl">
                              {initials}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {caregiverName}
                            </h3>
                            {caregiverUser?.city && (
                              <p className="text-xs text-gray-500 mt-1">
                                📍 {caregiverUser.city}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mt-1">
                              {caregiver.services.join(', ')}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-gray-600">
                                {caregiver.experienceYears} years exp
                              </span>
                              {caregiver.rating && (
                                <span className="flex items-center text-xs text-gray-600">
                                  <svg
                                    className="w-4 h-4 text-yellow-400 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  {caregiver.rating.toFixed(1)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              {caregiver.hourlyRate && (
                                <p className="font-bold text-primary-600 text-lg">
                                  ${(caregiver.hourlyRate / 100).toFixed(2)}/hr
                                </p>
                              )}
                              {caregiver.verified && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded font-medium">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <Link
                              to={`/bookings/new?caregiverId=${caregiverId}`}
                            >
                              <Button size="sm" className="mt-3 w-full">
                                Book Now
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Care Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Care Schedule
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  View and manage your upcoming appointments
                </p>
              </div>
              <Button onClick={() => setIsScheduleModalOpen(true)}>
                Schedule Appointment
              </Button>
            </div>
            <UpcomingSchedule />
          </div>
        )}

        {/* All Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <AllBookingsSection />
          </div>
        )}
      </div>

      {/* Modals */}
      <EmergencyRequest
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <ScheduleAppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </DashboardLayout>
  );
}
