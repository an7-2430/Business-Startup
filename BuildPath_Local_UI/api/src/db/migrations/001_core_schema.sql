-- ============================================================================
-- BuildPath MVP — Core Schema Migration
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- ============================================================================

-- ── Enable extensions ────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Industries ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS industries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_provider_id TEXT UNIQUE NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  state TEXT,
  industry_id UUID REFERENCES industries(id),
  business_type TEXT,
  onboarding_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Stages ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  industry_id UUID NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Steps ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage_id UUID NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0,
  checklist_json JSONB DEFAULT '[]'::jsonb,
  resources_json JSONB DEFAULT '[]'::jsonb,
  last_updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Step Prerequisites ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS step_prerequisites (
  step_id UUID NOT NULL REFERENCES steps(id) ON DELETE CASCADE,
  prerequisite_step_id UUID NOT NULL REFERENCES steps(id) ON DELETE CASCADE,
  PRIMARY KEY (step_id, prerequisite_step_id),
  CHECK (step_id <> prerequisite_step_id)
);

-- ── User Steps (progress tracking) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_steps (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES steps(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked', 'completed')),
  completed_at TIMESTAMPTZ,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, step_id)
);

-- ── Documents ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES steps(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Audit Log ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID REFERENCES users(id),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  diff_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Webhook Events ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_json JSONB DEFAULT '{}'::jsonb,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Updated-at trigger function ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON industries FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON stages FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON steps FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_steps FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS, so our API (using service_role key) can access everything.
-- These policies are for future client-side Supabase access if needed.

-- Users can read their own profile
CREATE POLICY users_own_read ON users FOR SELECT USING (auth.uid()::text = auth_provider_id);
CREATE POLICY users_own_update ON users FOR UPDATE USING (auth.uid()::text = auth_provider_id);

-- Users can read/write their own user_steps
CREATE POLICY user_steps_own ON user_steps FOR ALL USING (
  user_id IN (SELECT id FROM users WHERE auth_provider_id = auth.uid()::text)
);

-- Users can read/write their own documents
CREATE POLICY documents_own ON documents FOR ALL USING (
  user_id IN (SELECT id FROM users WHERE auth_provider_id = auth.uid()::text)
);

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider_id);
CREATE INDEX IF NOT EXISTS idx_stages_industry ON stages(industry_id, order_index);
CREATE INDEX IF NOT EXISTS idx_steps_stage ON steps(stage_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_steps_user ON user_steps(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_step ON documents(user_id, step_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
