'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

/**
 * Wrapper around Auth0's useUser hook.
 * Simply re-exports the hook for consistency.
 */
export function useAuth() {
  return useUser();
}
