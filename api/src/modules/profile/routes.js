const { Router } = require('express');
const { success, badRequest, notFound } = require('../../utils/response');
const requireAuth = require('../../middleware/auth');
const { getSupabase } = require('../../db/supabase');

const router = Router();

/**
 * GET /api/v1/me
 * Returns the authenticated user's profile.
 * Auto-creates a user record on first access (upsert pattern).
 */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const db = getSupabase();
    const authId = req.user.sub;
    const email = req.user.email;

    // Try to find existing user
    let { data: user, error } = await db
      .from('users')
      .select('*, industries(name)')
      .eq('auth_provider_id', authId)
      .single();

    if (error && error.code === 'PGRST116') {
      // User not found — auto-create
      const { data: newUser, error: insertErr } = await db
        .from('users')
        .insert({
          auth_provider_id: authId,
          email: email,
          role: 'user',
        })
        .select('*, industries(name)')
        .single();

      if (insertErr) throw insertErr;
      user = newUser;
    } else if (error) {
      throw error;
    }

    return success(res, {
      id: user.id,
      email: user.email,
      role: user.role,
      state: user.state,
      industry_id: user.industry_id,
      industry_name: user.industries?.name || null,
      business_type: user.business_type,
      onboarding_complete: user.onboarding_complete,
      created_at: user.created_at,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/v1/me
 * Updates onboarding selections and/or profile data.
 */
router.patch('/', requireAuth, async (req, res, next) => {
  try {
    const db = getSupabase();
    const authId = req.user.sub;
    const { state, industryId, businessType, onboardingComplete } = req.body;

    const updates = {};
    if (state !== undefined) updates.state = state;
    if (industryId !== undefined) updates.industry_id = industryId;
    if (businessType !== undefined) updates.business_type = businessType;
    if (onboardingComplete !== undefined) updates.onboarding_complete = onboardingComplete;

    if (Object.keys(updates).length === 0) {
      return badRequest(res, 'No fields to update');
    }

    // Validate industry exists if provided
    if (updates.industry_id) {
      const { data: ind } = await db
        .from('industries')
        .select('id')
        .eq('id', updates.industry_id)
        .eq('active', true)
        .single();

      if (!ind) {
        return badRequest(res, 'Invalid or inactive industry');
      }
    }

    const { data: user, error } = await db
      .from('users')
      .update(updates)
      .eq('auth_provider_id', authId)
      .select('*, industries(name)')
      .single();

    if (error) throw error;

    return success(res, {
      id: user.id,
      email: user.email,
      role: user.role,
      state: user.state,
      industry_id: user.industry_id,
      industry_name: user.industries?.name || null,
      business_type: user.business_type,
      onboarding_complete: user.onboarding_complete,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
