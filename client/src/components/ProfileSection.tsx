/**
 * Profile Section Component
 * User profile display and quick edit
 */

import { useState } from 'react';
import { useAuth } from '../features/auth/useAuth';
import { Card, Button, Modal, Input } from './';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../services/users';
import { getErrorMessage } from '../utils/errorHandler';
import { Spinner } from './';

export function ProfileSection() {
  const { user } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: () => updateProfile({ name, phone, city }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      setIsEditOpen(false);
    },
  });

  const handleSave = () => {
    updateMutation.mutate();
  };

  return (
    <>
      <Card>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
          <Button size="sm" variant="outline" onClick={() => setIsEditOpen(true)}>
            Quick Edit
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-bold text-xl">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
              <p className="text-sm text-gray-600 capitalize">{user?.role || 'user'}</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm font-medium text-gray-900">{user?.email || 'N/A'}</p>
            </div>
            {user?.phone && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="text-sm font-medium text-gray-900">{user.phone}</p>
              </div>
            )}
            {user?.city && (
              <div>
                <p className="text-xs text-gray-500 mb-1">City</p>
                <p className="text-sm font-medium text-gray-900">{user.city}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
          />
          <Input
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
          />

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
              onClick={() => setIsEditOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
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
    </>
  );
}

