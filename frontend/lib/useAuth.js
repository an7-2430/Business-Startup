'use client';

import { UserContext } from '@auth0/nextjs-auth0/client';
import { useContext } from 'react';

/**
 * Safe wrapper around Auth0's useUser hook that handles SSR gracefully.
 * Returns a default state when UserProvider context is not available.
 */
export function useAuth() {
  const context = useContext(UserContext);
  
  // If no context (during SSR/static generation), return default state
  if (!context) {
    return {
      user: undefined,
      error: undefined,
      isLoading: true,
    };
  }

  return context;
}
