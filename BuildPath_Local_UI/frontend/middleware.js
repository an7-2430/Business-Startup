import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

/**
 * Next.js middleware — protects routes that require authentication.
 * Unauthenticated users are redirected to Auth0 login.
 */
export default withMiddlewareAuthRequired();

/**
 * Route matcher — only these paths require authentication.
 * Public pages (/, /login) are NOT matched and remain accessible.
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/billing/:path*',
    '/settings/:path*',
    '/onboarding/:path*',
    '/steps/:path*',
  ],
};
