/**
 * Quick Actions Component
 * Enhanced quick actions section with all functionality
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from './';
import { EmergencyRequest } from './EmergencyRequest';

export function QuickActions() {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  const actions = [
    {
      id: 'schedule',
      label: 'Schedule Appointment',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      path: '/bookings/new',
      variant: 'primary' as const,
    },
    {
      id: 'emergency',
      label: 'Emergency Request',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      onClick: () => setIsEmergencyOpen(true),
      variant: 'primary' as const,
      className: 'bg-red-600 hover:bg-red-700 text-white',
    },
    {
      id: 'find-caregivers',
      label: 'Find Caregivers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      path: '/caregivers',
      variant: 'outline' as const,
    },
    {
      id: 'view-bookings',
      label: 'View All Bookings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      path: '/bookings',
      variant: 'outline' as const,
    },
    {
      id: 'health-records',
      label: 'Health Records',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: '/health',
      variant: 'outline' as const,
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      path: '/subscriptions',
      variant: 'outline' as const,
    },
  ];

  return (
    <>
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-2">
          {actions.map((action) => (
            action.path ? (
              <Link key={action.id} to={action.path}>
                <Button
                  fullWidth
                  variant={action.variant}
                  className={`!justify-start ${action.className || ''}`}
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </Button>
              </Link>
            ) : (
              <Button
                key={action.id}
                fullWidth
                variant={action.variant}
                className={`!justify-start ${action.className || ''}`}
                onClick={action.onClick}
              >
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </Button>
            )
          ))}
        </div>
      </Card>

      <EmergencyRequest isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />
    </>
  );
}


