import { handleAuth } from '@auth0/nextjs-auth0';

/**
 * Auth0 dynamic catch-all route handler.
 * Handles:
 *   /api/auth/login    → redirects to Auth0 login
 *   /api/auth/logout   → clears session and redirects home
 *   /api/auth/callback → handles Auth0 callback after login
 *   /api/auth/me       → returns current user session
 */
export const GET = handleAuth();
