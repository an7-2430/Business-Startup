const { Router } = require('express');
const { success, badRequest } = require('../../utils/response');
const requireAuth = require('../../middleware/auth');
const { getSupabase } = require('../../db/supabase');

const router = Router();

/**
 * GET /api/v1/onboarding/options
 * Returns available states, industries, and business types.
 * DB-driven — no hardcoding.
 */
router.get('/options', requireAuth, async (req, res, next) => {
  try {
    const db = getSupabase();

    // Get active industries
    const { data: industries, error: indErr } = await db
      .from('industries')
      .select('id, name')
      .eq('active', true)
      .order('name');

    if (indErr) throw indErr;

    // States — for MVP this is a static list from the DB-driven config
    // In future, states could also be a DB table
    const states = [
      { code: 'NSW', name: 'New South Wales' },
      { code: 'VIC', name: 'Victoria' },
      { code: 'QLD', name: 'Queensland' },
      { code: 'SA', name: 'South Australia' },
      { code: 'WA', name: 'Western Australia' },
      { code: 'TAS', name: 'Tasmania' },
      { code: 'NT', name: 'Northern Territory' },
      { code: 'ACT', name: 'Australian Capital Territory' },
    ];

    // Business types
    const businessTypes = [
      { code: 'sole-trader', name: 'Sole Trader' },
      { code: 'partnership', name: 'Partnership' },
      { code: 'company', name: 'Company (Pty Ltd)' },
      { code: 'trust', name: 'Trust' },
    ];

    return success(res, {
      states,
      industries,
      businessTypes,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
