/**
 * All Bookings Section Component
 * Complete booking management with filtering and pagination
 */

import { useState, useMemo } from 'react';
import { useBookings } from '../hooks/useBookings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelBooking, updateBooking } from '../services/bookings';
import { Card, Button, Select, Spinner, Modal, Input } from './';
import { formatDate, formatTime, formatCurrency, getRelativeTime } from '../utils/formatDate';
import { parseISO, isToday, isPast, isFuture } from 'date-fns';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../utils/errorHandler';
import type { Booking } from '../types';

export function AllBookingsSection() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editNotes, setEditNotes] = useState('');

  const limit = 10;

  const { data: bookingsData, isLoading } = useBookings({ page, limit });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setIsDetailsModalOpen(false);
      setSelectedBooking(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Booking> }) =>
      updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setIsEditModalOpen(false);
      setSelectedBooking(null);
    },
  });

  const filteredBookings = useMemo(() => {
    const bookings = bookingsData?.data || [];
    if (statusFilter === 'all') return bookings;

    return bookings.filter((booking) => {
      if (statusFilter === 'upcoming') {
        const startTime = parseISO(booking.startTime);
        return isFuture(startTime) && booking.status !== 'cancelled';
      }
      if (statusFilter === 'past') {
        const startTime = parseISO(booking.startTime);
        return isPast(startTime) || booking.status === 'completed';
      }
      return booking.status === statusFilter;
    });
  }, [bookingsData, statusFilter]);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditNotes(booking.notes || '');
    setIsDetailsModalOpen(true);
  };

  const handleEdit = () => {
    if (!selectedBooking) return;
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedBooking) return;
    const bookingId = (selectedBooking as any)._id || selectedBooking.id;
    updateMutation.mutate({
      id: bookingId,
      data: { notes: editNotes },
    });
  };

  const handleCancel = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelMutation.mutate(bookingId);
    }
  };

  const totalPages = bookingsData?.pagination?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Bookings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage and track all your care appointments
          </p>
        </div>
        <div className="flex gap-3">
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'all', label: 'All Bookings' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'requested', label: 'Requested' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
              { value: 'past', label: 'Past' },
            ]}
          />
          <Link to="/bookings/new">
            <Button>New Booking</Button>
          </Link>
        </div>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <Card>
          <div className="flex justify-center p-8">
            <Spinner size="lg" />
          </div>
        </Card>
      ) : filteredBookings.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
            <p className="text-gray-600 mb-2">No bookings found</p>
            <Link to="/bookings/new">
              <Button size="sm" className="mt-4">
                Schedule Appointment
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {filteredBookings.map((booking) => {
              const bookingId = (booking as any)._id || booking.id;
              const startTime = parseISO(booking.startTime);
              const endTime = booking.endTime ? parseISO(booking.endTime) : null;
              const isUpcoming = isFuture(startTime);
              const isTodayBooking = isToday(startTime);

              const statusColors = {
                requested: 'bg-yellow-50 border-yellow-200 text-yellow-700',
                confirmed: 'bg-blue-50 border-blue-200 text-blue-700',
                in_progress: 'bg-green-50 border-green-200 text-green-700',
                completed: 'bg-gray-50 border-gray-200 text-gray-700',
                cancelled: 'bg-red-50 border-red-200 text-red-700',
              };

              return (
                <Card
                  key={bookingId}
                  className={`cursor-pointer hover:shadow-md transition-all ${
                    statusColors[booking.status] || 'bg-white border-gray-200'
                  }`}
                  onClick={() => handleViewDetails(booking)}
                >
                  <div className="flex gap-4">
                    <div className="text-center min-w-[100px] flex-shrink-0">
                      <div
                        className={`p-3 rounded-lg ${
                          isTodayBooking
                            ? 'bg-primary-100'
                            : isUpcoming
                              ? 'bg-blue-100'
                              : 'bg-gray-100'
                        }`}
                      >
                        <p
                          className={`text-2xl font-bold ${
                            isTodayBooking
                              ? 'text-primary-700'
                              : isUpcoming
                                ? 'text-blue-700'
                                : 'text-gray-700'
                          }`}
                        >
                          {formatTime(startTime).split(' ')[0]}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {formatTime(startTime).split(' ')[1]}
                        </p>
                        {endTime && (
                          <p className="text-xs text-gray-500 mt-1">
                            - {formatTime(endTime)}
                          </p>
                        )}
                      </div>
                      {isTodayBooking && (
                        <p className="text-xs text-primary-600 font-medium mt-2">
                          Today
                        </p>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {booking.notes || 'Care Session'}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            📍 {booking.address}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{formatDate(startTime, 'EEEE, MMM d, yyyy')}</span>
                            <span>•</span>
                            <span>{getRelativeTime(booking.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
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
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(booking.priceCents)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Page {page} of {totalPages} •{' '}
                {bookingsData?.pagination?.total || 0} total bookings
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Booking Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBooking(null);
        }}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    selectedBooking.status === 'confirmed'
                      ? 'bg-blue-100 text-blue-700'
                      : selectedBooking.status === 'in_progress'
                        ? 'bg-green-100 text-green-700'
                        : selectedBooking.status === 'completed'
                          ? 'bg-gray-100 text-gray-700'
                          : selectedBooking.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {selectedBooking.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Price</p>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(selectedBooking.priceCents)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Date & Time</p>
              <p className="font-medium text-gray-900">
                {formatDate(parseISO(selectedBooking.startTime), 'EEEE, MMM d, yyyy')} at{' '}
                {formatTime(parseISO(selectedBooking.startTime))}
              </p>
              {selectedBooking.endTime && (
                <p className="text-sm text-gray-600 mt-1">
                  Until {formatTime(parseISO(selectedBooking.endTime))}
                </p>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Address</p>
              <p className="font-medium text-gray-900">{selectedBooking.address}</p>
            </div>

            {selectedBooking.notes && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <p className="text-sm text-gray-900">{selectedBooking.notes}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500 mb-1">Created</p>
              <p className="text-sm text-gray-600">
                {getRelativeTime(selectedBooking.createdAt)}
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              {selectedBooking.status !== 'cancelled' &&
                selectedBooking.status !== 'completed' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleEdit}
                      className="flex-1"
                    >
                      Edit Notes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleCancel((selectedBooking as any)._id || selectedBooking.id)
                      }
                      disabled={cancelMutation.isPending}
                      className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
                    </Button>
                  </>
                )}
              <Button
                variant="primary"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedBooking(null);
                }}
                className="flex-1"
              >
                Close
              </Button>
            </div>

            {cancelMutation.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  {getErrorMessage(cancelMutation.error)}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Notes Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBooking(null);
        }}
        title="Edit Booking Notes"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={4}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Add or update notes..."
            />
          </div>

          {updateMutation.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {getErrorMessage(updateMutation.error)}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedBooking(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveEdit}
              disabled={updateMutation.isPending}
              className="flex-1"
            >
              {updateMutation.isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

