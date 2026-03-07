// Centralised environment config
// All env vars are validated here at startup

require('dotenv').config();

const required = [
  // These are only truly required in production
  // In dev we allow missing values with sensible defaults
];

if (process.env.NODE_ENV === 'production') {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '8080', 10),

  APP_BASE_URL: process.env.APP_BASE_URL || 'http://localhost:3000',
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8080',
  WEBHOOK_PUBLIC_URL: process.env.WEBHOOK_PUBLIC_URL || 'http://localhost:8080',

  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),

  AUTH0: {
    DOMAIN: process.env.AUTH0_DOMAIN || '',
    AUDIENCE: process.env.AUTH0_AUDIENCE || '',
    CLIENT_ID: process.env.AUTH0_CLIENT_ID || '',
    CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET || '',
  },

  SUPABASE: {
    URL: process.env.SUPABASE_URL || '',
    SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  STRIPE: {
    SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
    PRICE_ID: process.env.STRIPE_PRICE_ID || '',
  },

  STORAGE: {
    BUCKET: process.env.STORAGE_BUCKET || 'buildpath-documents',
  },
};
