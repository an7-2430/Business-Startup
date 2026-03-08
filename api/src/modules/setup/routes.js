const { Router } = require('express');
const { success, badRequest, notFound } = require('../../utils/response');
const requireAuth = require('../../middleware/auth');
const { getSupabase } = require('../../db/supabase');

const router = Router();

// Validate valid stage keys
const STAGE_KEYS = [
  'legal_and_registration',     // Stage 2
  'location_and_premises',      // Stage 3
  'compliance_and_safety',      // Stage 4
  'equipment_and_operations',   // Stage 5
  'digital_and_finance',        // Stage 6
  'launch_readiness'            // Stage 7
];

/**
 * GET /api/v1/setup
 * Fetches the user's current business profile and stage progress.
 */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const db = getSupabase();
    
    // 1. Get User ID from auth_provider_id
    const { data: user, error: userErr } = await db
      .from('users')
      .select('id, state, industry_id, business_type, onboarding_complete')
      .eq('auth_provider_id', req.user.sub)
      .single();

    if (userErr || !user) {
      return notFound(res, 'User not found. Please complete Stage 1 (Onboarding).');
    }

    // 2. Fetch or auto-create the business profile
    let { data: profile, error: profileErr } = await db
      .from('user_business_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileErr && profileErr.code === 'PGRST116') {
      // Auto-create blank profile on first fetch
      const { data: newProfile, error: insertErr } = await db
        .from('user_business_profiles')
        .insert({
          user_id: user.id,
          stage_statuses: { "1": user.onboarding_complete ? "completed" : "in_progress", "2": "not_started", "3": "not_started", "4": "not_started", "5": "not_started", "6": "not_started", "7": "not_started" }
        })
        .select()
        .single();
        
      if (insertErr) throw insertErr;
      profile = newProfile;
    } else if (profileErr) {
      throw profileErr;
    }

    // Combine Stage 1 (from users table) with Stages 2-7
    return success(res, {
      user_id: user.id,
      stage_1: {
        state: user.state,
        industry_id: user.industry_id,
        business_type: user.business_type,
        onboarding_complete: user.onboarding_complete
      },
      stage_2: profile.legal_and_registration,
      stage_3: profile.location_and_premises,
      stage_4: profile.compliance_and_safety,
      stage_5: profile.equipment_and_operations,
      stage_6: profile.digital_and_finance,
      stage_7: profile.launch_readiness,
      stage_statuses: profile.stage_statuses,
      overall_progress_percent: profile.overall_progress_percent
    });

  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/v1/setup/:stageKey
 * Saves data for a specific stage.
 * Request body: { data: Object, isDraft: Boolean, stageNumber: String }
 */
router.patch('/:stageKey', requireAuth, async (req, res, next) => {
  try {
    const db = getSupabase();
    const { stageKey } = req.params;
    const { data, isDraft, stageNumber } = req.body;

    if (!STAGE_KEYS.includes(stageKey)) {
      return badRequest(res, 'Invalid stage key provided.');
    }

    if (!stageNumber || !['2', '3', '4', '5', '6', '7'].includes(stageNumber.toString())) {
      return badRequest(res, 'Valid stageNumber is required.');
    }

    // 1. Get internal user ID
    const { data: user, error: userErr } = await db
      .from('users')
      .select('id')
      .eq('auth_provider_id', req.user.sub)
      .single();

    if (userErr || !user) throw new Error('User not found');

    // 2. Fetch current profile to update statuses safely
    const { data: profile } = await db
      .from('user_business_profiles')
      .select('stage_statuses')
      .eq('user_id', user.id)
      .single();

    const currentStatuses = profile?.stage_statuses || {};
    
    // Determine new status
    const newStatus = isDraft ? 'in_progress' : 'completed';
    const updatedStatuses = { ...currentStatuses, [stageNumber]: newStatus };

    // Calculate overall percent (Stages 1-7 = 14.28% each)
    let completedCount = 0;
    Object.values(updatedStatuses).forEach(status => {
      if (status === 'completed') completedCount++;
    });
    const percent = Math.round((completedCount / 7) * 100);

    // 3. Update the specific JSON column and statuses
    const updatePayload = {
      [stageKey]: data,
      stage_statuses: updatedStatuses,
      overall_progress_percent: percent
    };

    const { data: updatedProfile, error: updateErr } = await db
      .from('user_business_profiles')
      .update(updatePayload)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return success(res, updatedProfile);

  } catch (err) {
    next(err);
  }
});

module.exports = router;
