# 6. Data Model (Supabase Postgres)

## 6.1 Tables (Minimum)
**users**
- id (uuid, pk)
- auth_provider_id (text) — Auth0 user id
- email (text)
- role (text: user/admin)
- state (text)
- industry_id (uuid, fk)
- business_type (text)
- created_at, updated_at

**industries**
- id (uuid, pk)
- name (text)
- active (bool)
- created_at, updated_at

**stages**
- id (uuid, pk)
- industry_id (uuid, fk)
- title (text)
- order_index (int)
- created_at, updated_at

**steps**
- id (uuid, pk)
- stage_id (uuid, fk)
- title (text)
- description (text)
- order_index (int)
- checklist_json (jsonb) — checklist items
- resources_json (jsonb) — links/resources
- last_updated_at (timestamp)
- created_at, updated_at

**step_prerequisites**
- step_id (uuid, fk -> steps.id)
- prerequisite_step_id (uuid, fk -> steps.id)
- primary key (step_id, prerequisite_step_id)

**user_steps**
- user_id (uuid, fk -> users.id)
- step_id (uuid, fk -> steps.id)
- status (text: locked/unlocked/completed)
- completed_at (timestamp, nullable)
- note (text, nullable)
- created_at, updated_at
- primary key (user_id, step_id)

**documents**
- id (uuid, pk)
- user_id (uuid, fk)
- step_id (uuid, fk)
- storage_path (text)
- filename (text)
- mime_type (text)
- created_at

**audit_log**
- id (uuid, pk)
- admin_user_id (uuid, fk)
- entity_type (text)
- entity_id (uuid)
- action (text: create/update/delete)
- diff_json (jsonb)
- created_at

**webhook_events**
- id (uuid, pk)
- provider (text) — stripe, placeholder
- event_type (text)
- payload_json (jsonb)
- processed (bool)
- processed_at (timestamp)
- created_at

## 6.2 Row Level Security (RLS) Guidance
- Users can read/write only their own `user_steps` and `documents`.
- Admin role can manage industries/stages/steps and view audit/webhook events.

---
