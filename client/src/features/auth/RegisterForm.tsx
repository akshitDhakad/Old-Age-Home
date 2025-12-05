/**
 * Register Form Component
 * Handles user registration
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterInput } from '../../api/schema';
import { register as registerService } from '../../services/auth';
import { useAuth } from './useAuth';
import { Button, Input, Select } from '../../components';

export function RegisterForm() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'customer',
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerService,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      // Redirect based on user role
      const redirectPath =
        data.user.role === 'caregiver'
          ? '/caregiver/onboarding'
          : '/customer/dashboard';
      navigate(redirectPath);
    },
    onError: (err: Error) => {
      setError(err.message || 'Registration failed. Please try again.');
    },
  });

  const onSubmit = (data: RegisterInput) => {
    setError(null);
    registerMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-2xl"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create Account
        </h2>
        <p className="text-gray-600">Join Home-First Care today</p>
      </div>

      {error && (
        <div
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        autoComplete="name"
        placeholder="Enter your full name"
        {...register('name')}
        error={errors.name?.message}
        required
      />
      <div className="grid grid-cols-2 gap-x-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          {...register('email')}
          error={errors.email?.message}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          autoComplete="tel"
          placeholder="Enter your phone number (optional)"
          {...register('phone')}
          error={errors.phone?.message}
        />
      </div>

      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="Create a password"
        {...register('password')}
        error={errors.password?.message}
        required
      />

      <Select
        label="I am a"
        {...register('role')}
        error={errors.role?.message}
        options={[
          { value: 'customer', label: 'Customer (Looking for care)' },
          { value: 'caregiver', label: 'Caregiver (Providing care)' },
        ]}
        required
      />

      <Button
        type="submit"
        fullWidth
        isLoading={registerMutation.isPending}
        disabled={registerMutation.isPending}
      >
        Create Account
      </Button>

      <div className="text-sm text-center text-gray-600">
        <p>
          Already have an account?{' '}
          <a href="/login" className="text-primary-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>

      <p className="text-xs text-gray-500 text-center">
        By signing up, you agree to our{' '}
        <a href="/terms" className="text-primary-600 hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-primary-600 hover:underline">
          Privacy Policy
        </a>
      </p>
    </form>
  );
}
