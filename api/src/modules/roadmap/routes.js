const { Router } = require('express');
const { success, notFound, badRequest } = require('../../utils/response');
const requireAuth = require('../../middleware/auth');
const { getSupabase } = require('../../db/supabase');

const router = Router();

/**
 * GET /api/v1/roadmap
 * Returns the full roadmap (stages + steps) for the authenticated user's industry.
 * Steps include computed status (locked/unlocked/completed) based on prerequisite completion.
 */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const db = getSupabase();
    const authId = req.user.sub;

    // 1. Get user profile
    const { data: user, error: userErr } = await db
      .from('users')
      .select('id, industry_id')
      .eq('auth_provider_id', authId)
      .single();

    if (userErr || !user) {
      return success(res, { stages: [], progress: { completed: 0, total: 0, percent: 0 } });
    }

    if (!user.industry_id) {
      return success(res, { stages: [], progress: { completed: 0, total: 0, percent: 0 } });
    }

    // 2. Get all stages for the user's industry
    const { data: stages, error: stagesErr } = await db
      .from('stages')
      .select('id, title, order_index')
      .eq('industry_id', user.industry_id)
      .order('order_index');

    if (stagesErr) throw stagesErr;

    // 3. Get all steps for those stages
    const stageIds = stages.map((s) => s.id);
    const { data: steps, error: stepsErr } = await db
      .from('steps')
      .select('id, stage_id, title, description, order_index, checklist_json, resources_json, last_updated_at')
      .in('stage_id', stageIds)
      .order('order_index');

    if (stepsErr) throw stepsErr;

    // 4. Get prerequisites
    const stepIds = steps.map((s) => s.id);
    const { data: prereqs, error: prereqErr } = await db
      .from('step_prerequisites')
      .select('step_id, prerequisite_step_id')
      .in('step_id', stepIds);

    if (prereqErr) throw prereqErr;

    // 5. Get user's step progress
    const { data: userSteps, error: usErr } = await db
      .from('user_steps')
      .select('step_id, status, completed_at, note')
      .eq('user_id', user.id);

    if (usErr) throw usErr;

    // Build lookup maps
    const userStepMap = {};
    (userSteps || []).forEach((us) => { userStepMap[us.step_id] = us; });

    const prereqMap = {};
    (prereqs || []).forEach((p) => {
      if (!prereqMap[p.step_id]) prereqMap[p.step_id] = [];
      prereqMap[p.step_id].push(p.prerequisite_step_id);
    });

    // 6. Compute status for each step using dependency engine
    const computedSteps = steps.map((step) => {
      const userStep = userStepMap[step.id];

      // If user has explicitly completed this step
      if (userStep?.status === 'completed') {
        return { ...step, status: 'completed', completed_at: userStep.completed_at, note: userStep.note };
      }

      // Check prerequisites
      const requiredPrereqs = prereqMap[step.id] || [];
      const allPrereqsMet = requiredPrereqs.every((prereqId) => {
        return userStepMap[prereqId]?.status === 'completed';
      });

      // No prerequisites = unlocked; all prerequisites met = unlocked; otherwise locked
      const status = requiredPrereqs.length === 0 || allPrereqsMet ? 'unlocked' : 'locked';

      return {
        ...step,
        status,
        completed_at: null,
        note: userStep?.note || null,
        prerequisites: requiredPrereqs,
      };
    });

    // 7. Calculate progress
    const total = computedSteps.length;
    const completed = computedSteps.filter((s) => s.status === 'completed').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 8. Group steps by stage
    const stagesWithSteps = stages.map((stage) => ({
      ...stage,
      steps: computedSteps.filter((s) => s.stage_id === stage.id),
    }));

    return success(res, {
      stages: stagesWithSteps,
      progress: { completed, total, percent },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/steps/:id
 * Returns detail for a single step with computed status.
 */
router.get('/steps/:id', requireAuth, async (req, res, next) => {
  try {
    const db = getSupabase();
    const authId = req.user.sub;
    const stepId = req.params.id;

    // Get user
    const { data: user } = await db
      .from('users')
      .select('id')
      .eq('auth_provider_id', authId)
      .single();

    if (!user) return notFound(res, 'User');

    // Get step
    const { data: step, error: stepErr } = await db
      .from('steps')
      .select('*, stages(title, order_index)')
      .eq('id', stepId)
      .single();

    if (stepErr || !step) return notFound(res, 'Step');

    // Get prerequisites
    const { data: prereqs } = await db
      .from('step_prerequisites')
      .select('prerequisite_step_id, steps!step_prerequisites_prerequisite_step_id_fkey(title)')
      .eq('step_id', stepId);

    // Get user progress for this step and its prereqs
    const prereqIds = (prereqs || []).map((p) => p.prerequisite_step_id);
    const allIds = [stepId, ...prereqIds];
    const { data: userSteps } = await db
      .from('user_steps')
      .select('step_id, status, completed_at, note')
      .eq('user_id', user.id)
      .in('step_id', allIds);

    const userStepMap = {};
    (userSteps || []).forEach((us) => { userStepMap[us.step_id] = us; });

    // Compute status
    const userStep = userStepMap[stepId];
    let status = 'unlocked';
    if (userStep?.status === 'completed') {
      status = 'completed';
    } else if (prereqIds.length > 0) {
      const allMet = prereqIds.every((id) => userStepMap[id]?.status === 'completed');
      status = allMet ? 'unlocked' : 'locked';
    }

    return success(res, {
      ...step,
      status,
      completed_at: userStep?.completed_at || null,
      note: userStep?.note || null,
      prerequisites: (prereqs || []).map((p) => ({
        step_id: p.prerequisite_step_id,
        title: p.steps?.title,
        completed: userStepMap[p.prerequisite_step_id]?.status === 'completed',
      })),
      stage_title: step.stages?.title,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/steps/:id/complete
 * Marks a step as completed for the current user.
 * Enforces dependency rules — cannot complete a locked step.
 */
router.post('/steps/:id/complete', requireAuth, async (req, res, next) => {
  try {
    const db = getSupabase();
    const authId = req.user.sub;
    const stepId = req.params.id;

    // Get user
    const { data: user } = await db
      .from('users')
      .select('id')
      .eq('auth_provider_id', authId)
      .single();

    if (!user) return notFound(res, 'User');

    // Verify step exists
    const { data: step } = await db
      .from('steps')
      .select('id')
      .eq('id', stepId)
      .single();

    if (!step) return notFound(res, 'Step');

    // Check prerequisites are all completed
    const { data: prereqs } = await db
      .from('step_prerequisites')
      .select('prerequisite_step_id')
      .eq('step_id', stepId);

    if (prereqs && prereqs.length > 0) {
      const prereqIds = prereqs.map((p) => p.prerequisite_step_id);
      const { data: completedPrereqs } = await db
        .from('user_steps')
        .select('step_id')
        .eq('user_id', user.id)
        .in('step_id', prereqIds)
        .eq('status', 'completed');

      if ((completedPrereqs || []).length < prereqIds.length) {
        return badRequest(res, 'Cannot complete step — prerequisites not met');
      }
    }

    // Upsert user_steps record
    const { data: userStep, error } = await db
      .from('user_steps')
      .upsert({
        user_id: user.id,
        step_id: stepId,
        status: 'completed',
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,step_id' })
      .select()
      .single();

    if (error) throw error;

    // Recalculate progress
    const { data: allSteps } = await db
      .from('user_steps')
      .select('step_id')
      .eq('user_id', user.id)
      .eq('status', 'completed');

    // Get total steps for user's industry (from their stages)
    const { data: userProfile } = await db
      .from('users')
      .select('industry_id')
      .eq('id', user.id)
      .single();

    let total = 0;
    if (userProfile?.industry_id) {
      const { count } = await db
        .from('steps')
        .select('id', { count: 'exact', head: true })
        .in('stage_id',
          db.from('stages').select('id').eq('industry_id', userProfile.industry_id)
        );
      total = count || 0;
    }

    const completed = (allSteps || []).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return success(res, {
      step_id: stepId,
      status: 'completed',
      progress: { completed, total, percent },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/steps/:id/note
 * Creates or updates a user note for a step.
 */
router.post('/steps/:id/note', requireAuth, async (req, res, next) => {
  try {
    const db = getSupabase();
    const authId = req.user.sub;
    const stepId = req.params.id;
    const { note } = req.body;

    if (note === undefined) return badRequest(res, 'Note is required');

    // Get user
    const { data: user } = await db
      .from('users')
      .select('id')
      .eq('auth_provider_id', authId)
      .single();

    if (!user) return notFound(res, 'User');

    // Upsert user_steps with note
    const { data: userStep, error } = await db
      .from('user_steps')
      .upsert({
        user_id: user.id,
        step_id: stepId,
        note,
        status: 'unlocked',
      }, { onConflict: 'user_id,step_id' })
      .select()
      .single();

    if (error) throw error;

    return success(res, { step_id: stepId, note: userStep.note });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
