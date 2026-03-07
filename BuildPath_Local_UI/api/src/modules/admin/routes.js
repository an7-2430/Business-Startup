const { Router } = require('express');
const { success, badRequest, notFound } = require('../../utils/response');
const requireAuth = require('../../middleware/auth');
const requireRole = require('../../middleware/rbac');
const { getSupabase } = require('../../db/supabase');

const router = Router();
const adminOnly = [requireAuth, requireRole('admin')];

// ── Helper: log admin action ─────────────────────────────────────────────────
async function logAudit(db, adminUserId, entityType, entityId, action, diffJson = {}) {
  await db.from('audit_log').insert({
    admin_user_id: adminUserId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    diff_json: diffJson,
  });
}

async function getAdminUserId(db, authId) {
  const { data } = await db.from('users').select('id').eq('auth_provider_id', authId).single();
  return data?.id;
}

// ══════════════════════════════════════════════════════════════════════════════
// INDUSTRIES
// ══════════════════════════════════════════════════════════════════════════════

router.get('/industries', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    const { data, error } = await db.from('industries').select('*').order('name');
    if (error) throw error;
    return success(res, data);
  } catch (err) { next(err); }
});

router.post('/industries', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    const { name } = req.body;
    if (!name) return badRequest(res, 'name is required');

    const { data, error } = await db.from('industries').insert({ name }).select().single();
    if (error) throw error;

    const adminId = await getAdminUserId(db, req.user.sub);
    await logAudit(db, adminId, 'industry', data.id, 'create', { name });

    return success(res, data, 201);
  } catch (err) { next(err); }
});

router.patch('/industries/:id', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    const { data, error } = await db.from('industries').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    if (!data) return notFound(res, 'Industry');

    const adminId = await getAdminUserId(db, req.user.sub);
    await logAudit(db, adminId, 'industry', data.id, 'update', req.body);

    return success(res, data);
  } catch (err) { next(err); }
});

router.delete('/industries/:id', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    const adminId = await getAdminUserId(db, req.user.sub);
    await logAudit(db, adminId, 'industry', req.params.id, 'delete');

    const { error } = await db.from('industries').delete().eq('id', req.params.id);
    if (error) throw error;
    return success(res, { deleted: true });
  } catch (err) { next(err); }
});

// ══════════════════════════════════════════════════════════════════════════════
// STAGES
// ══════════════════════════════════════════════════════════════════════════════

router.get('/stages', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    let query = db.from('stages').select('*, industries(name)').order('order_index');
    if (req.query.industryId) query = query.eq('industry_id', req.query.industryId);
    const { data, error } = await query;
    if (error) throw error;
    return success(res, data);
  } catch (err) { next(err); }
});

router.post('/stages', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    const { industryId, title, orderIndex } = req.body;
    if (!industryId || !title) return badRequest(res, 'industryId and title required');

    const { data, error } = await db.from('stages').insert({
      industry_id: industryId, title, order_index: orderIndex || 0,
    }).select().single();
    if (error) throw error;

    const adminId = await getAdminUserId(db, req.user.sub);
    await logAudit(db, adminId, 'stage', data.id, 'create', { title });
    return success(res, data, 201);
  } catch (err) { next(err); }
});

router.patch('/stages/:id', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.orderIndex !== undefined) updates.order_index = req.body.orderIndex;
    if (req.body.industryId !== undefined) updates.industry_id = req.body.industryId;

    const { data, error } = await db.from('stages').update(updates).eq('id', req.params.id).select().single();
    if (error) throw error;

    const adminId = await getAdminUserId(db, req.user.sub);
    await logAudit(db, adminId, 'stage', data.id, 'update', updates);
    return success(res, data);
  } catch (err) { next(err); }
});

router.delete('/stages/:id', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    const adminId = await getAdminUserId(db, req.user.sub);
    await logAudit(db, adminId, 'stage', req.params.id, 'delete');
    const { error } = await db.from('stages').delete().eq('id', req.params.id);
    if (error) throw error;
    return success(res, { deleted: true });
  } catch (err) { next(err); }
});

// ══════════════════════════════════════════════════════════════════════════════
// STEPS
// ══════════════════════════════════════════════════════════════════════════════

router.get('/steps', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    let query = db.from('steps').select('*, stages(title, industry_id)').order('order_index');
    if (req.query.stageId) query = query.eq('stage_id', req.query.stageId);
    const { data, error } = await query;
    if (error) throw error;
    return success(res, data);
  } catch (err) { next(err); }
});

router.post('/steps', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    const { stageId, title, description, orderIndex, checklistJson, resourcesJson } = req.body;
    if (!stageId || !title) return badRequest(res, 'stageId and title required');

    const { data, error } = await db.from('steps').insert({
      stage_id: stageId, title, description,
      order_index: orderIndex || 0,
      checklist_json: checklistJson || [],
      resources_json: resourcesJson || [],
    }).select().single();
    if (error) throw error;

    const adminId = await getAdminUserId(db, req.user.sub);
    await logAudit(db, adminId, 'step', data.id, 'create', { title });
    return success(res, data, 201);
  } catch (err) { next(err); }
});

router.patch('/steps/:id', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    const updates = {};
    const fields = ['title', 'description', 'order_index', 'checklist_json', 'resources_json', 'stage_id'];
    const bodyMap = { order_index: 'orderIndex', stage_id: 'stageId', checklist_json: 'checklistJson', resources_json: 'resourcesJson' };

    fields.forEach((f) => {
      const bodyKey = bodyMap[f] || f;
      if (req.body[bodyKey] !== undefined) updates[f] = req.body[bodyKey];
    });
    updates.last_updated_at = new Date().toISOString();

    const { data, error } = await db.from('steps').update(updates).eq('id', req.params.id).select().single();
    if (error) throw error;

    const adminId = await getAdminUserId(db, req.user.sub);
    await logAudit(db, adminId, 'step', data.id, 'update', updates);
    return success(res, data);
  } catch (err) { next(err); }
});

router.delete('/steps/:id', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    const adminId = await getAdminUserId(db, req.user.sub);
    await logAudit(db, adminId, 'step', req.params.id, 'delete');
    const { error } = await db.from('steps').delete().eq('id', req.params.id);
    if (error) throw error;
    return success(res, { deleted: true });
  } catch (err) { next(err); }
});

// ══════════════════════════════════════════════════════════════════════════════
// PREREQUISITES (with cycle detection)
// ══════════════════════════════════════════════════════════════════════════════

router.post('/steps/:id/prerequisites', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    const stepId = req.params.id;
    const { prerequisiteStepId } = req.body;

    if (!prerequisiteStepId) return badRequest(res, 'prerequisiteStepId required');
    if (stepId === prerequisiteStepId) return badRequest(res, 'Step cannot be its own prerequisite');

    // Cycle detection: check if adding this prereq would create a cycle
    // A cycle exists if prerequisiteStepId (or its transitive dependents) eventually requires stepId
    const visited = new Set();
    async function hasCycle(currentId) {
      if (currentId === stepId) return true;
      if (visited.has(currentId)) return false;
      visited.add(currentId);

      const { data: deps } = await db.from('step_prerequisites')
        .select('step_id')
        .eq('prerequisite_step_id', currentId);

      for (const dep of (deps || [])) {
        if (await hasCycle(dep.step_id)) return true;
      }
      return false;
    }

    if (await hasCycle(prerequisiteStepId)) {
      return badRequest(res, 'Adding this prerequisite would create a circular dependency');
    }

    const { error } = await db.from('step_prerequisites').insert({
      step_id: stepId,
      prerequisite_step_id: prerequisiteStepId,
    });
    if (error) throw error;

    const adminId = await getAdminUserId(db, req.user.sub);
    await logAudit(db, adminId, 'step_prerequisite', stepId, 'create', { prerequisiteStepId });

    return success(res, { step_id: stepId, prerequisite_step_id: prerequisiteStepId }, 201);
  } catch (err) { next(err); }
});

router.delete('/steps/:id/prerequisites/:prereqId', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    const { error } = await db.from('step_prerequisites')
      .delete()
      .eq('step_id', req.params.id)
      .eq('prerequisite_step_id', req.params.prereqId);
    if (error) throw error;

    const adminId = await getAdminUserId(db, req.user.sub);
    await logAudit(db, adminId, 'step_prerequisite', req.params.id, 'delete', { removedPrereq: req.params.prereqId });

    return success(res, { deleted: true });
  } catch (err) { next(err); }
});

// ══════════════════════════════════════════════════════════════════════════════
// AUDIT LOG
// ══════════════════════════════════════════════════════════════════════════════

router.get('/audit-log', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    const limit = parseInt(req.query.limit || '50');
    const { data, error } = await db.from('audit_log')
      .select('*, users(email)')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return success(res, data);
  } catch (err) { next(err); }
});

// ══════════════════════════════════════════════════════════════════════════════
// WEBHOOK EVENTS
// ══════════════════════════════════════════════════════════════════════════════

router.get('/webhook-events', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    const { data, error } = await db.from('webhook_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return success(res, data);
  } catch (err) { next(err); }
});

// ══════════════════════════════════════════════════════════════════════════════
// USERS & BUSINESS PROFILES
// ══════════════════════════════════════════════════════════════════════════════

router.get('/users', ...adminOnly, async (req, res, next) => {
  try {
    const db = getSupabase();
    
    // Fetch users and join their setup profiles
    const { data: users, error } = await db
      .from('users')
      .select(`
        id, 
        email, 
        role, 
        state, 
        business_type, 
        onboarding_complete,
        created_at,
        industries (name),
        user_business_profiles (
          stage_statuses,
          overall_progress_percent,
          legal_and_registration,
          location_and_premises,
          compliance_and_safety,
          equipment_and_operations,
          digital_and_finance,
          launch_readiness
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedUsers = users.map(u => ({
      ...u,
      industry_name: u.industries?.name,
      profile: u.user_business_profiles?.[0] || null
    }));

    return success(res, formattedUsers);
  } catch (err) { next(err); }
});

module.exports = router;
