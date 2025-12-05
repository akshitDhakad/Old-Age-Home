/**
 * Customer Dashboard Page
 * Professional dashboard for customers to manage care, health monitoring, and caregivers
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCaregivers } from '../../services/caregivers';
import { useDebounce } from '../../hooks/useDebounce';

import {
  Card,
  Input,
  Button,
  Select,
  Spinner,
  DecorativeDoodles,
} from '../../components';
import { useAuth } from '../../features/auth/useAuth';

export function CustomerDashboard() {
  const { user } = useAuth();
  const [searchCity, setSearchCity] = useState('');
  const [searchService, setSearchService] = useState('');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'health' | 'caregivers' | 'schedule'
  >('overview');
  const debouncedCity = useDebounce(searchCity, 500);

  const { data: caregiversData, isLoading } = useQuery({
    queryKey: ['caregivers', debouncedCity, searchService],
    queryFn: () =>
      getCaregivers({
        city: debouncedCity || undefined,
        service: searchService || undefined,
        page: 1,
        limit: 10,
      }),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50/30 relative overflow-hidden">
      <DecorativeDoodles variant="light" density="low" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-2">
                Your complete care management dashboard
              </p>
            </div>
            <Button variant="primary" className="shadow-md">
              <svg
                className="w-5 h-5 mr-2"
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
              Emergency Request
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 flex gap-2 overflow-x-auto">
            <Button
              onClick={() => setActiveTab('overview')}
              variant={activeTab === 'overview' ? 'primary' : 'ghost'}
              size="sm"
              className={`whitespace-nowrap ${
                activeTab !== 'overview'
                  ? 'bg-white border border-gray-200 hover:bg-gray-50'
                  : ''
              }`}
            >
              Overview
            </Button>
            <Button
              onClick={() => setActiveTab('health')}
              variant={activeTab === 'health' ? 'primary' : 'ghost'}
              size="sm"
              className={`whitespace-nowrap ${
                activeTab !== 'health'
                  ? 'bg-white border border-gray-200 hover:bg-gray-50'
                  : ''
              }`}
            >
              Health Monitoring
            </Button>
            <Button
              onClick={() => setActiveTab('caregivers')}
              variant={activeTab === 'caregivers' ? 'primary' : 'ghost'}
              size="sm"
              className={`whitespace-nowrap ${
                activeTab !== 'caregivers'
                  ? 'bg-white border border-gray-200 hover:bg-gray-50'
                  : ''
              }`}
            >
              Find Caregivers
            </Button>
            <Button
              onClick={() => setActiveTab('schedule')}
              variant={activeTab === 'schedule' ? 'primary' : 'ghost'}
              size="sm"
              className={`whitespace-nowrap ${
                activeTab !== 'schedule'
                  ? 'bg-white border border-gray-200 hover:bg-gray-50'
                  : ''
              }`}
            >
              Care Schedule
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-primary-100 text-sm font-medium">
                        Active Care Hours
                      </p>
                      <p className="text-3xl font-bold mt-2">24.5</p>
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

                <Card className="bg-gradient-to-br from-accent-500 to-accent-600 text-white border-none">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-accent-100 text-sm font-medium">
                        Health Score
                      </p>
                      <p className="text-3xl font-bold mt-2">8.7/10</p>
                      <p className="text-accent-100 text-xs mt-1">
                        +0.3 from last week
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
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-secondary-400 to-secondary-500 text-white border-none">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-secondary-100 text-sm font-medium">
                        Next Appointment
                      </p>
                      <p className="text-3xl font-bold mt-2">2h</p>
                      <p className="text-secondary-100 text-xs mt-1">
                        Physiotherapy session
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
                  <Button size="sm" variant="outline">
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-4 p-4 bg-primary-50 rounded-lg border border-primary-100">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-600">10</p>
                      <p className="text-xs text-gray-600">AM</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Morning Medication
                      </p>
                      <p className="text-sm text-gray-600">
                        Blood pressure pills + Vitamin D
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                          Reminder Set
                        </span>
                      </div>
                    </div>
                    <Button size="sm" className="self-start">
                      Mark Done
                    </Button>
                  </div>

                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-600">02</p>
                      <p className="text-xs text-gray-600">PM</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Physiotherapy Session
                      </p>
                      <p className="text-sm text-gray-600">
                        With Dr. Sarah Johnson - 60 minutes
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs text-gray-600">
                          Home Visit
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                  </div>

                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-600">06</p>
                      <p className="text-xs text-gray-600">PM</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Evening Care
                      </p>
                      <p className="text-sm text-gray-600">
                        Companion care with Maria
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-green-600"
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
                        Medication taken
                      </p>
                      <p className="text-sm text-gray-600">
                        Morning dose completed at 10:00 AM
                      </p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Health vitals recorded
                      </p>
                      <p className="text-sm text-gray-600">
                        BP: 120/80, Heart Rate: 72 bpm
                      </p>
                      <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Caregiver visit completed
                      </p>
                      <p className="text-sm text-gray-600">
                        Maria completed evening care session
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Monthly Care Budget</span>
                      <span className="font-semibold text-gray-900">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      $1,500 of $2,000 used
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        Care Hours This Week
                      </span>
                      <span className="font-semibold text-gray-900">18/25</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-accent-500 h-2 rounded-full"
                        style={{ width: '72%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Active Caregiver */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Primary Caregiver
                </h3>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-700 font-bold text-lg">
                      MJ
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Maria Johnson</p>
                    <p className="text-sm text-gray-600">Certified Nurse</p>
                    <div className="flex items-center gap-1 mt-2">
                      <svg
                        className="w-4 h-4 text-secondary-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        4.9
                      </span>
                      <span className="text-xs text-gray-500">
                        (127 reviews)
                      </span>
                    </div>
                    <Button size="sm" className="mt-3 w-full" variant="outline">
                      Contact
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Subscriptions */}
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Active Plan
                </h2>
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-4 rounded-lg border border-primary-100">
                  <p className="font-semibold text-gray-900">Monthly Premium</p>
                  <p className="text-2xl font-bold text-primary-600 mt-1">
                    $399/mo
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    20 hours included
                  </p>
                  <Button size="sm" className="mt-3 w-full" variant="outline">
                    Manage Plan
                  </Button>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    fullWidth
                    variant="outline"
                    className="!justify-start"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
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
                    Schedule Appointment
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    className="!justify-start"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    View Medical Records
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    className="!justify-start"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Rent Equipment
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Health Monitoring Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-none">
                <p className="text-red-100 text-sm">Blood Pressure</p>
                <p className="text-3xl font-bold mt-2">120/80</p>
                <p className="text-red-100 text-xs mt-1">mmHg • Normal</p>
              </Card>
              <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-none">
                <p className="text-pink-100 text-sm">Heart Rate</p>
                <p className="text-3xl font-bold mt-2">72</p>
                <p className="text-pink-100 text-xs mt-1">bpm • Healthy</p>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
                <p className="text-blue-100 text-sm">Blood Sugar</p>
                <p className="text-3xl font-bold mt-2">95</p>
                <p className="text-blue-100 text-xs mt-1">mg/dL • Normal</p>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none">
                <p className="text-purple-100 text-sm">Temperature</p>
                <p className="text-3xl font-bold mt-2">98.6°F</p>
                <p className="text-purple-100 text-xs mt-1">Normal Range</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Trends */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Health Trends (7 Days)
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Blood Pressure</span>
                      <span className="text-green-600 font-medium">
                        ↓ Improving
                      </span>
                    </div>
                    <div className="h-24 bg-gradient-to-t from-green-50 to-transparent rounded-lg border border-green-100 flex items-end justify-around p-2">
                      <div
                        className="w-8 bg-green-200 rounded-t"
                        style={{ height: '60%' }}
                      ></div>
                      <div
                        className="w-8 bg-green-200 rounded-t"
                        style={{ height: '55%' }}
                      ></div>
                      <div
                        className="w-8 bg-green-300 rounded-t"
                        style={{ height: '50%' }}
                      ></div>
                      <div
                        className="w-8 bg-green-300 rounded-t"
                        style={{ height: '45%' }}
                      ></div>
                      <div
                        className="w-8 bg-green-400 rounded-t"
                        style={{ height: '42%' }}
                      ></div>
                      <div
                        className="w-8 bg-green-400 rounded-t"
                        style={{ height: '40%' }}
                      ></div>
                      <div
                        className="w-8 bg-green-500 rounded-t"
                        style={{ height: '38%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Heart Rate</span>
                      <span className="text-blue-600 font-medium">
                        → Stable
                      </span>
                    </div>
                    <div className="h-24 bg-gradient-to-t from-blue-50 to-transparent rounded-lg border border-blue-100 flex items-end justify-around p-2">
                      <div
                        className="w-8 bg-blue-300 rounded-t"
                        style={{ height: '50%' }}
                      ></div>
                      <div
                        className="w-8 bg-blue-300 rounded-t"
                        style={{ height: '52%' }}
                      ></div>
                      <div
                        className="w-8 bg-blue-300 rounded-t"
                        style={{ height: '48%' }}
                      ></div>
                      <div
                        className="w-8 bg-blue-300 rounded-t"
                        style={{ height: '51%' }}
                      ></div>
                      <div
                        className="w-8 bg-blue-300 rounded-t"
                        style={{ height: '49%' }}
                      ></div>
                      <div
                        className="w-8 bg-blue-300 rounded-t"
                        style={{ height: '50%' }}
                      ></div>
                      <div
                        className="w-8 bg-blue-300 rounded-t"
                        style={{ height: '50%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Medication Schedule */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Today's Medications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-white"
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
                      <p className="font-semibold text-gray-900">
                        Morning Dose - Completed
                      </p>
                      <p className="text-sm text-gray-600">
                        Lisinopril 10mg, Aspirin 81mg
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Taken at 10:00 AM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
                    <div className="bg-primary-500 p-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-white"
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
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Afternoon Dose - Upcoming
                      </p>
                      <p className="text-sm text-gray-600">Metformin 500mg</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due at 2:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="bg-gray-400 p-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-white"
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
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Evening Dose
                      </p>
                      <p className="text-sm text-gray-600">Lisinopril 10mg</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due at 8:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Health Reports */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Health Reports
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-xs text-purple-700 font-medium">
                      Lab Results
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    Complete Blood Count
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Dec 1, 2024</p>
                  <Button size="sm" className="mt-3 w-full" variant="outline">
                    View Report
                  </Button>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-xs text-green-700 font-medium">
                      Checkup
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900">Annual Physical</p>
                  <p className="text-sm text-gray-600 mt-1">Nov 28, 2024</p>
                  <Button size="sm" className="mt-3 w-full" variant="outline">
                    View Report
                  </Button>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                      </svg>
                    </div>
                    <span className="text-xs text-blue-700 font-medium">
                      Therapy
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    Physical Therapy
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ongoing</p>
                  <Button size="sm" className="mt-3 w-full" variant="outline">
                    View Progress
                  </Button>
                </div>
              </div>
            </Card>
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
                  ]}
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                />
              </div>

              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Spinner />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {caregiversData?.data.map((caregiver) => (
                    <div
                      key={caregiver.id}
                      className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-primary-200 transition-all duration-200"
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-700 font-bold text-xl">
                            {caregiver.userId.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {caregiver.userId}
                          </h3>
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
                                  className="w-4 h-4 text-secondary-400 mr-1"
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
                          <Button size="sm" className="mt-3 w-full">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {caregiversData?.data.length === 0 && (
                    <p className="text-center text-gray-600 py-8 col-span-2">
                      No caregivers found. Try adjusting your search filters.
                    </p>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Care Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Weekly Care Schedule
                    </h2>
                    <Button size="sm">Add Appointment</Button>
                  </div>
                  <div className="space-y-4">
                    {/* Monday */}
                    <div>
                      <p className="font-semibold text-gray-700 mb-2">
                        Monday, Dec 5
                      </p>
                      <div className="space-y-2">
                        <div className="flex gap-3 p-4 bg-primary-50 rounded-lg border border-primary-100">
                          <div className="text-center min-w-[60px]">
                            <p className="text-lg font-bold text-primary-600">
                              09:00
                            </p>
                            <p className="text-xs text-gray-600">AM</p>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              Morning Medication
                            </p>
                            <p className="text-sm text-gray-600">
                              Daily routine - Blood pressure medication
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                        <div className="flex gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="text-center min-w-[60px]">
                            <p className="text-lg font-bold text-blue-600">
                              11:00
                            </p>
                            <p className="text-xs text-gray-600">AM</p>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              Physical Therapy Session
                            </p>
                            <p className="text-sm text-gray-600">
                              With Dr. Sarah Johnson - Home visit
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Tuesday */}
                    <div>
                      <p className="font-semibold text-gray-700 mb-2">
                        Tuesday, Dec 6
                      </p>
                      <div className="space-y-2">
                        <div className="flex gap-3 p-4 bg-primary-50 rounded-lg border border-primary-100">
                          <div className="text-center min-w-[60px]">
                            <p className="text-lg font-bold text-primary-600">
                              09:00
                            </p>
                            <p className="text-xs text-gray-600">AM</p>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              Morning Medication
                            </p>
                            <p className="text-sm text-gray-600">
                              Daily routine
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                        <div className="flex gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <div className="text-center min-w-[60px]">
                            <p className="text-lg font-bold text-purple-600">
                              02:00
                            </p>
                            <p className="text-xs text-gray-600">PM</p>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              Companion Care
                            </p>
                            <p className="text-sm text-gray-600">
                              With Maria - Activities and socialization
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar - Care Team */}
              <div className="space-y-6">
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Care Team
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-semibold">
                          MJ
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          Maria Johnson
                        </p>
                        <p className="text-xs text-gray-600">Primary Nurse</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-semibold">SJ</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          Dr. Sarah Johnson
                        </p>
                        <p className="text-xs text-gray-600">
                          Physical Therapist
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-700 font-semibold">DP</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          Dr. Patel
                        </p>
                        <p className="text-xs text-gray-600">
                          Primary Physician
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Upcoming
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
                      <p className="text-sm font-semibold text-gray-900">
                        Medication Refill
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Due in 3 days
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm font-semibold text-gray-900">
                        Annual Checkup
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Next month</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
