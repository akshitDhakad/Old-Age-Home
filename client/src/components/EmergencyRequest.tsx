/**
 * Emergency Request Component
 * Comprehensive emergency care request form with notifications
 */

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEmergencyRequest } from '../services/emergency';
import { getCaregivers } from '../services/caregivers';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../features/auth/useAuth';
import { Button, Input, Select, Modal, Spinner } from './';
import { getErrorMessage } from '../utils/errorHandler';

interface EmergencyRequestProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyRequest({ isOpen, onClose }: EmergencyRequestProps) {
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [caregiverId, setCaregiverId] = useState('');
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  // Fetch available caregivers
  const { data: caregiversData, isLoading: caregiversLoading } = useQuery({
    queryKey: ['caregivers', 'emergency'],
    queryFn: () => getCaregivers({ page: 1, limit: 50 }),
    enabled: isOpen,
  });

  const createMutation = useMutation({
    mutationFn: () => {
      if (!address.trim()) {
        throw new Error('Please enter an address');
      }
      return createEmergencyRequest({
        caregiverId: caregiverId || undefined,
        address: address.trim(),
        notes: notes.trim() || undefined,
        phone: phone.trim() || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    },
  });

  const handleClose = () => {
    setSuccess(false);
    setAddress('');
    setCaregiverId('');
    setNotes('');
    setPhone(user?.phone || '');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="🚨 Emergency Care Request" size="lg">
      {success ? (
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Emergency Request Sent!
          </h3>
          <p className="text-gray-600 mb-4">
            Your emergency request has been sent to all caregivers and administrators.
            They will be notified via email and dashboard notifications.
          </p>
          <p className="text-sm text-gray-500">
            Someone will contact you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Alert Banner */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Emergency Request:</strong> This will notify all available caregivers
                  and administrators immediately via email and dashboard notifications.
                </p>
              </div>
            </div>
          </div>

          {/* Caregiver Selection (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Specific Caregiver (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Leave empty to notify all available caregivers
            </p>
            {caregiversLoading ? (
              <div className="flex justify-center p-4">
                <Spinner />
              </div>
            ) : (
              <Select
                value={caregiverId}
                onChange={(e) => setCaregiverId(e.target.value)}
                options={[
                  { value: '', label: 'Notify All Caregivers (Recommended)' },
                  ...((caregiversData?.data || []).map((cg: any) => {
                    const caregiverName =
                      typeof cg.userId === 'object' && cg.userId !== null
                        ? (cg.userId as any).name || 'Caregiver'
                        : 'Caregiver';
                    return {
                      value: cg._id || cg.id,
                      label: `${caregiverName} - ${cg.services?.join(', ') || 'General Care'}`,
                    };
                  }) || []),
                ]}
              />
            )}
          </div>

          {/* Address */}
          <Input
            label="Address"
            placeholder="Enter your full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            helperText="Please provide your complete address for emergency response"
          />

          {/* Phone */}
          <Input
            label="Contact Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            helperText="Optional: Help caregivers contact you directly"
          />

          {/* Emergency Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Details <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Describe the emergency situation, symptoms, or immediate needs..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Provide as much detail as possible to help caregivers respond appropriately
            </p>
          </div>

          {/* Error Display */}
          {createMutation.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {getErrorMessage(createMutation.error)}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
              disabled={createMutation.isPending || !address.trim() || !notes.trim()}
            >
              {createMutation.isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Sending Request...
                </>
              ) : (
                <>
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Send Emergency Request
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

