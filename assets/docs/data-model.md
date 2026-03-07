# Data Model — BuildPath (MVP)

**Primary database:** Supabase Postgres  
**Alternative:** MongoDB Atlas  

---

## 1. Core Entities

### users
- id
- auth_provider_id
- email
- role
- state
- industry_id
- business_type
- created_at
- updated_at

### industries
- id
- name
- active
- created_at
- updated_at

### stages
- id
- industry_id
- title
- order_index
- created_at
- updated_at

### steps
- id
- stage_id
- title
- description
- order_index
- checklist_json
- resources_json
- last_updated_at
- created_at
- updated_at

### step_prerequisites
- step_id
- prerequisite_step_id

### user_steps
- user_id
- step_id
- status
- completed_at
- note
- created_at
- updated_at

### documents
- id
- user_id
- step_id
- storage_path
- filename
- mime_type
- created_at

### audit_log
- id
- admin_user_id
- entity_type
- entity_id
- action
- diff_json
- created_at

### webhook_events
- id
- provider
- event_type
- payload_json
- processed
- processed_at
- created_at

---

## 2. Relationship Summary

- one **industry** has many **stages**
- one **stage** has many **steps**
- one **step** can have many **prerequisite steps**
- one **user** has many **user_steps**
- one **user_step** belongs to one **step**
- one **user** can upload many **documents**
- one **step** can have many user-specific **documents**

---

## 3. Important Enums

### role
- user
- admin

### user_steps.status
- locked
- unlocked
- completed

### audit_log.action
- create
- update
- delete

---

## 4. Computed Logic Notes

### Step status
Computed server-side based on prerequisite completion.

### Progress
`completed_steps / total_steps * 100`

### Last updated
Pulled from `steps.last_updated_at` and surfaced in UI.
