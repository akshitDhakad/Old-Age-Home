/**
 * Profile Modal Component
 * Comprehensive profile management with full functionality
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile, getMyProfile } from '../services/users';
import { Modal, Input, Button, Spinner, Card } from './';
import { getErrorMessage } from '../utils/errorHandler';
import { formatDate } from '../utils/formatDate';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');

  // Load user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setCity(user.city || '');
      setEmail(user.email || '');
    }
  }, [isOpen, user]);

  const updateMutation = useMutation({
    mutationFn: () => updateProfile({ name, phone, city }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      await queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      // Refresh user data
      const updatedUser = await getMyProfile();
      queryClient.setQueryData(['auth', 'me'], updatedUser);
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }
    updateMutation.mutate();
  };

  const hasChanges = 
    name !== (user?.name || '') ||
    phone !== (user?.phone || '') ||
    city !== (user?.city || '');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Profile" size="lg">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-700 font-bold text-3xl">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{user?.name || 'User'}</h3>
            <p className="text-sm text-gray-600">{user?.email || ''}</p>
            <p className="text-xs text-gray-500 capitalize mt-1">
              {user?.role || 'user'} • Member since {user?.createdAt ? formatDate(user.createdAt, 'MMM yyyy') : 'N/A'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'security'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'preferences'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Preferences
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <Card className="bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Personal Information</h4>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
                <Input
                  label="Email Address"
                  value={email}
                  disabled
                  helperText="Email cannot be changed"
                  className="bg-gray-100"
                />
                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1234567890"
                  type="tel"
                />
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city"
                />
              </div>
            </Card>

            {updateMutation.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  {getErrorMessage(updateMutation.error)}
                </p>
              </div>
            )}

            {updateMutation.isSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">
                  Profile updated successfully!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <Card className="bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Security Settings</h4>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Last changed: {user?.updatedAt ? formatDate(user.updatedAt, 'MMM d, yyyy') : 'Never'}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Change Password
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Enable
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Active Sessions</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Manage your active sessions
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Sessions
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <Card className="bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Notification Preferences</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-600">Receive updates via email</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600" />
                </label>
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-xs text-gray-600">Receive updates via SMS</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-primary-600" />
                </label>
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Booking Reminders</p>
                    <p className="text-xs text-gray-600">Get reminders before appointments</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600" />
                </label>
              </div>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={updateMutation.isPending}
          >
            {activeTab === 'profile' && hasChanges ? 'Cancel' : 'Close'}
          </Button>
          {activeTab === 'profile' && hasChanges && (
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={updateMutation.isPending || !name.trim()}
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
          )}
        </div>
      </div>
    </Modal>
  );
}

