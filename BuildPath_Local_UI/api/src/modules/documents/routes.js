const { Router } = require('express');
const { success, badRequest, notFound } = require('../../utils/response');
const requireAuth = require('../../middleware/auth');
const { getSupabase } = require('../../db/supabase');

const router = Router();

/**
 * GET /api/v1/documents?stepId=xxx
 * Lists documents for the authenticated user, optionally filtered by step.
 */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const db = getSupabase();
    const authId = req.user.sub;

    const { data: user } = await db.from('users').select('id').eq('auth_provider_id', authId).single();
    if (!user) return notFound(res, 'User');

    let query = db.from('documents').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (req.query.stepId) query = query.eq('step_id', req.query.stepId);

    const { data, error } = await query;
    if (error) throw error;

    return success(res, data);
  } catch (err) { next(err); }
});

/**
 * POST /api/v1/documents/upload
 * Uploads a document to Supabase Storage and records metadata.
 * Expects multipart form data with file + stepId.
 * For now, stores file path reference (actual upload handled via signed URL flow).
 */
router.post('/upload', requireAuth, async (req, res, next) => {
  try {
    const db = getSupabase();
    const authId = req.user.sub;
    const { stepId, filename, mimeType } = req.body;

    if (!stepId || !filename) return badRequest(res, 'stepId and filename required');

    const { data: user } = await db.from('users').select('id').eq('auth_provider_id', authId).single();
    if (!user) return notFound(res, 'User');

    // Generate storage path
    const storagePath = `${user.id}/${stepId}/${Date.now()}_${filename}`;

    // Create signed upload URL
    const bucket = process.env.STORAGE_BUCKET || 'buildpath-documents';
    const { data: signedUrl, error: signErr } = await db.storage
      .from(bucket)
      .createSignedUploadUrl(storagePath);

    if (signErr) {
      // If storage not configured, still record the document
      const { data: doc, error: docErr } = await db.from('documents').insert({
        user_id: user.id,
        step_id: stepId,
        storage_path: storagePath,
        filename,
        mime_type: mimeType || 'application/octet-stream',
      }).select().single();

      if (docErr) throw docErr;
      return success(res, { document: doc, uploadUrl: null, message: 'Storage not configured — metadata saved' }, 201);
    }

    // Record document metadata
    const { data: doc, error: docErr } = await db.from('documents').insert({
      user_id: user.id,
      step_id: stepId,
      storage_path: storagePath,
      filename,
      mime_type: mimeType || 'application/octet-stream',
    }).select().single();

    if (docErr) throw docErr;

    return success(res, { document: doc, uploadUrl: signedUrl.signedUrl }, 201);
  } catch (err) { next(err); }
});

/**
 * GET /api/v1/documents/:id/download
 * Returns a signed download URL for a document.
 */
router.get('/:id/download', requireAuth, async (req, res, next) => {
  try {
    const db = getSupabase();
    const authId = req.user.sub;

    const { data: user } = await db.from('users').select('id').eq('auth_provider_id', authId).single();
    if (!user) return notFound(res, 'User');

    const { data: doc } = await db.from('documents').select('*').eq('id', req.params.id).eq('user_id', user.id).single();
    if (!doc) return notFound(res, 'Document');

    const bucket = process.env.STORAGE_BUCKET || 'buildpath-documents';
    const { data: signedUrl, error } = await db.storage.from(bucket).createSignedUrl(doc.storage_path, 3600);

    if (error) return success(res, { document: doc, downloadUrl: null, message: 'Storage not configured' });

    return success(res, { document: doc, downloadUrl: signedUrl.signedUrl });
  } catch (err) { next(err); }
});

/**
 * DELETE /api/v1/documents/:id
 * Deletes a document (metadata + storage).
 */
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const db = getSupabase();
    const authId = req.user.sub;

    const { data: user } = await db.from('users').select('id').eq('auth_provider_id', authId).single();
    if (!user) return notFound(res, 'User');

    const { data: doc } = await db.from('documents').select('*').eq('id', req.params.id).eq('user_id', user.id).single();
    if (!doc) return notFound(res, 'Document');

    // Delete from storage
    const bucket = process.env.STORAGE_BUCKET || 'buildpath-documents';
    await db.storage.from(bucket).remove([doc.storage_path]);

    // Delete metadata
    await db.from('documents').delete().eq('id', doc.id);

    return success(res, { deleted: true });
  } catch (err) { next(err); }
});

module.exports = router;
