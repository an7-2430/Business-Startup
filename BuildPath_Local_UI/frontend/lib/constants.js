// App-wide constants

export const APP_NAME = 'BuildPath';
export const APP_VERSION = '0.1.0';

// Step status values — matches DB enum
export const STEP_STATUS = {
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  COMPLETED: 'completed',
};

// User roles — matches Auth0 role claim
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// API routes (relative to NEXT_PUBLIC_API_URL)
export const API_ROUTES = {
  ME: '/me',
  ROADMAP: '/roadmap',
  STEPS: '/steps',
  PAYMENTS_CHECKOUT: '/payments/checkout',
  PAYMENTS_STATUS: '/payments/status',
  ADMIN_INDUSTRIES: '/admin/industries',
  ADMIN_STAGES: '/admin/stages',
  ADMIN_STEPS: '/admin/steps',
  ADMIN_AUDIT_LOG: '/admin/audit-log',
  ADMIN_WEBHOOK_EVENTS: '/admin/webhook-events',
};

// Nav links for the sidebar (used in dashboard shell)
export const SIDEBAR_NAV = [
  { label: 'Roadmap', href: '/dashboard', icon: '🗺️' },
  { label: 'Documents', href: '/dashboard/documents', icon: '📁' },
  { label: 'Billing', href: '/dashboard/billing', icon: '💳' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export const ADMIN_NAV = [
  { label: 'Industries', href: '/admin/industries', icon: '🏭' },
  { label: 'Stages', href: '/admin/stages', icon: '📋' },
  { label: 'Steps', href: '/admin/steps', icon: '✅' },
  { label: 'Audit Log', href: '/admin/audit-log', icon: '📜' },
  { label: 'Webhook Events', href: '/admin/webhook-events', icon: '🔔' },
];
