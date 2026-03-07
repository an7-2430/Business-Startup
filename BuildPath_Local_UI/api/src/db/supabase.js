const { createClient } = require('@supabase/supabase-js');
const config = require('../config/env');

let supabase = null;

/**
 * Get or create the Supabase client (singleton).
 * Uses the service role key for server-side operations.
 */
function getSupabase() {
  if (!supabase) {
    if (!config.SUPABASE.URL || !config.SUPABASE.SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    }
    supabase = createClient(config.SUPABASE.URL, config.SUPABASE.SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return supabase;
}

module.exports = { getSupabase };
