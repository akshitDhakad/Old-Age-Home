# Backend Integration Guide

This document explains how the frontend connects to the backend API and best practices for using the API client.

## Environment Configuration

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE=http://localhost:4000
VITE_ENV=development
```

## API Client

The API client (`src/api/client.ts`) provides:

- **Automatic token management**: Stores and refreshes JWT tokens
- **Error handling**: Consistent error handling across all API calls
- **Type safety**: Full TypeScript support
- **Token refresh**: Automatic token refresh on 401 errors

### Usage Example

```typescript
import { apiGet, apiPost } from '@/api/client';

// GET request
const data = await apiGet<User>('/users/profile');

// POST request
const result = await apiPost<Booking>('/bookings', bookingData);
```

## Service Layer

Services (`src/services/`) abstract API calls and provide type-safe interfaces:

- `auth.ts` - Authentication (login, register, logout)
- `bookings.ts` - Booking operations
- `caregivers.ts` - Caregiver profiles and search
- `users.ts` - User profile management

## React Query Hooks

Custom hooks (`src/hooks/`) provide data persistence and caching:

### Bookings

```typescript
import { useBookings, useCreateBooking } from '@/hooks/useBookings';

function MyComponent() {
  const { data, isLoading, error } = useBookings({ page: 1, limit: 10 });
  const createBooking = useCreateBooking();

  const handleCreate = async () => {
    try {
      await createBooking.mutateAsync(bookingData);
      // Cache automatically updated
    } catch (error) {
      // Handle error
    }
  };
}
```

### Caregivers

```typescript
import { useCaregivers, useMyCaregiverProfile } from '@/hooks/useCaregivers';

function SearchComponent() {
  const { data, isLoading } = useCaregivers({
    city: 'Mumbai',
    service: 'nursing',
  });
}
```

### Users

```typescript
import { useMyProfile, useUpdateProfile } from '@/hooks/useUsers';

function ProfileComponent() {
  const { data: profile } = useMyProfile();
  const updateProfile = useUpdateProfile();

  const handleUpdate = async (data) => {
    await updateProfile.mutateAsync(data);
  };
}
```

## Error Handling

Use the error handler utilities for consistent error handling:

```typescript
import { getErrorMessage, getValidationErrors } from '@/utils/errorHandler';

try {
  await someApiCall();
} catch (error) {
  const validationErrors = getValidationErrors(error);
  if (validationErrors) {
    // Handle validation errors
  } else {
    const message = getErrorMessage(error);
    // Show error message
  }
}
```

## Form Validation

All forms use Zod schemas for validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/api/schema';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema),
});
```

## Authentication

The `AuthProvider` manages authentication state:

```typescript
import { useAuth } from '@/features/auth/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <div>Welcome, {user?.name}</div>;
}
```

## API Endpoints

All endpoints are prefixed with `/api/v1`:

- `/api/v1/auth/*` - Authentication
- `/api/v1/users/*` - User management
- `/api/v1/caregivers/*` - Caregiver operations
- `/api/v1/bookings/*` - Booking management

## Best Practices

1. **Always use hooks**: Use React Query hooks for data fetching
2. **Handle errors**: Always handle errors in try-catch blocks
3. **Show loading states**: Use `isLoading` from hooks
4. **Validate forms**: Use Zod schemas for form validation
5. **Type safety**: Use TypeScript types from `@/types`
6. **Cache management**: Let React Query handle caching automatically

## Token Management

Tokens are automatically managed:

- Stored in `localStorage` (development)
- Automatically refreshed on 401 errors
- Cleared on logout

**Note**: In production, consider using httpOnly cookies for better security.


