// Auth helpers — session utilities for Auth0 integration
import { getSession as auth0GetSession } from '@auth0/nextjs-auth0';

/**
 * Get the current Auth0 session (server-side only).
 * Returns the session object or null if not authenticated.
 */
export async function getSession() {
  try {
    const session = await auth0GetSession();
    return session;
  } catch {
    return null;
  }
}

/**
 * Check if the user has admin role.
 * Reads from Auth0 custom namespace claim.
 */
export function isAdmin(session) {
  if (!session?.user) return false;
  const roles = session.user['https://buildpath.app/roles'] || [];
  return roles.includes('admin');
}

/**
 * Get user roles from session.
 */
export function getUserRoles(session) {
  if (!session?.user) return [];
  return session.user['https://buildpath.app/roles'] || [];
}

export const LOGIN_PATH = '/login';
export const DASHBOARD_PATH = '/dashboard';
