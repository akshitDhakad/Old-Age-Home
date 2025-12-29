/**
 * Schedule Appointment Modal Component
 * Complete appointment scheduling functionality
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCaregivers } from '../services/caregivers';
import { createBooking } from '../services/bookings';
import { Modal, Input, Button, Select, Spinner, Card } from './';
import { getErrorMessage } from '../utils/errorHandler';
import { formatDate, formatTime } from '../utils/formatDate';
import type { BookingInput } from '../api/schema';

interface ScheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCaregiverId?: string;
}

export function ScheduleAppointmentModal({
  isOpen,
  onClose,
  preselectedCaregiverId,
}: ScheduleAppointmentModalProps) {
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [caregiverId, setCaregiverId] = useState(preselectedCaregiverId || '');
  const [selectedCaregiver, setSelectedCaregiver] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchService, setSearchService] = useState('');

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setCaregiverId(preselectedCaregiverId || '');
      setSelectedCaregiver(null);
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      setAddress('');
      setNotes('');
    }
  }, [isOpen, preselectedCaregiverId]);

  // Set default dates
  useEffect(() => {
    if (isOpen && !startDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setStartDate(tomorrow.toISOString().split('T')[0]);
      setStartTime('09:00');
    }
  }, [isOpen, startDate]);

  // Fetch caregivers
  const { data: caregiversData, isLoading: caregiversLoading } = useQuery({
    queryKey: ['caregivers', 'schedule', searchCity, searchService],
    queryFn: () =>
      getCaregivers({
        city: searchCity || undefined,
        service: searchService || undefined,
        page: 1,
        limit: 50,
      }),
    enabled: isOpen && step === 1,
  });

  // Fetch selected caregiver details
  const { data: caregiverDetails } = useQuery({
    queryKey: ['caregiver', caregiverId],
    queryFn: async () => {
      if (!caregiverId) return null;
      const caregivers = await getCaregivers({ page: 1, limit: 100 });
      return caregivers.data.find((c: any) => (c._id || c.id) === caregiverId);
    },
    enabled: !!caregiverId && isOpen,
  });

  useEffect(() => {
    if (caregiverDetails) {
      setSelectedCaregiver(caregiverDetails);
    }
  }, [caregiverDetails]);

  const createMutation = useMutation({
    mutationFn: (data: BookingInput) => createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      onClose();
    },
  });

  const handleNext = () => {
    if (step === 1 && caregiverId) {
      setStep(2);
    } else if (step === 2 && startDate && startTime && address) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = () => {
    if (!caregiverId || !startDate || !startTime || !address) {
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;

    if (endDateTime && endDateTime <= startDateTime) {
      alert('End time must be after start time');
      return;
    }

    const bookingData: BookingInput = {
      caregiverId,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime?.toISOString(),
      address,
      notes: notes || undefined,
    };

    createMutation.mutate(bookingData);
  };

  const canProceedStep1 = !!caregiverId;
  const canProceedStep2 = !!startDate && !!startTime && !!address.trim();
  const canSubmit = canProceedStep2 && !!caregiverId;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Appointment" size="xl">
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
                <p
                  className={`text-xs mt-2 ${
                    step >= s ? 'text-primary-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  {s === 1 ? 'Caregiver' : s === 2 ? 'Details' : 'Review'}
                </p>
              </div>
              {s < 3 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    step > s ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Caregiver */}
        {step === 1 && (
          <div className="space-y-4">
            <Card className="bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Search Caregivers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="City"
                  placeholder="Filter by city"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
                <Select
                  label="Service"
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                  options={[
                    { value: '', label: 'All Services' },
                    { value: 'nursing', label: 'Nursing Care' },
                    { value: 'physiotherapy', label: 'Physiotherapy' },
                    { value: 'adl', label: 'ADL' },
                    { value: 'companionship', label: 'Companionship' },
                    { value: 'medication', label: 'Medication Management' },
                  ]}
                />
              </div>
            </Card>

            {caregiversLoading ? (
              <div className="flex justify-center p-8">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(caregiversData?.data || []).map((caregiver: any) => {
                  const id = caregiver._id || caregiver.id;
                  const caregiverName =
                    typeof caregiver.userId === 'object' && caregiver.userId !== null
                      ? (caregiver.userId as any).name || 'Caregiver'
                      : 'Caregiver';
                  const isSelected = caregiverId === id;

                  return (
                    <div
                      key={id}
                      onClick={() => setCaregiverId(id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-primary-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-700 font-bold">
                            {caregiverName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900">{caregiverName}</h4>
                          <p className="text-sm text-gray-600">
                            {caregiver.services?.join(', ') || 'General Care'}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            {caregiver.rating && (
                              <span className="text-xs text-gray-600">
                                ⭐ {caregiver.rating.toFixed(1)}
                              </span>
                            )}
                            {caregiver.experienceYears && (
                              <span className="text-xs text-gray-600">
                                {caregiver.experienceYears} years exp
                              </span>
                            )}
                            {caregiver.hourlyRate && (
                              <span className="text-xs font-semibold text-primary-600">
                                ${(caregiver.hourlyRate / 100).toFixed(2)}/hr
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="text-primary-600">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Appointment Details */}
        {step === 2 && (
          <div className="space-y-4">
            {selectedCaregiver && (
              <Card className="bg-primary-50 border-primary-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-bold">
                      {typeof selectedCaregiver.userId === 'object'
                        ? (selectedCaregiver.userId as any).name?.charAt(0).toUpperCase()
                        : 'C'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {typeof selectedCaregiver.userId === 'object'
                        ? (selectedCaregiver.userId as any).name
                        : 'Caregiver'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedCaregiver.services?.join(', ')}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
              />
              <Input
                label="Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
              <Input
                label="End Date (Optional)"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
              />
              <Input
                label="End Time (Optional)"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={!endDate}
              />
            </div>

            <Input
              label="Address"
              placeholder="Enter full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Any special requirements or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-4">
            <Card className="bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Appointment Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Caregiver:</span>
                  <span className="font-medium text-gray-900">
                    {selectedCaregiver && typeof selectedCaregiver.userId === 'object'
                      ? (selectedCaregiver.userId as any).name
                      : 'Selected Caregiver'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium text-gray-900">
                    {startDate && startTime
                      ? `${formatDate(new Date(`${startDate}T${startTime}`), 'MMM d, yyyy')} at ${formatTime(new Date(`${startDate}T${startTime}`))}`
                      : 'N/A'}
                  </span>
                </div>
                {endDate && endTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Time:</span>
                    <span className="font-medium text-gray-900">
                      {formatTime(new Date(`${endDate}T${endTime}`))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium text-gray-900 text-right max-w-xs">
                    {address || 'N/A'}
                  </span>
                </div>
                {notes && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-gray-600 mb-1">Notes:</p>
                    <p className="text-sm text-gray-900">{notes}</p>
                  </div>
                )}
              </div>
            </Card>

            {createMutation.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  {getErrorMessage(createMutation.error)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2)
              }
              className="flex-1"
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!canSubmit || createMutation.isPending}
              className="flex-1"
            >
              {createMutation.isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Scheduling...
                </>
              ) : (
                'Confirm Appointment'
              )}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

