# Epic 5 — Admin CMS (Industries/Steps/Prereqs)

## Goal
Enable admin to manage roadmap content without redeploy and keep content fresh.

## Stories
**5.1 Admin auth gate + basic admin shell**
- **Acceptance Criteria:**
  1. `/admin` only accessible by admin role.
  2. Non-admin blocked with access denied.
  3. UI follows Stitch theme.

**5.2 CRUD industries/stages/steps**
- **Acceptance Criteria:**
  1. Admin can create/edit/delete industries.
  2. Admin can create/edit/delete stages and steps.
  3. Admin can reorder steps and assign stages.

**5.3 Manage prerequisites + prevent cycles**
- **Acceptance Criteria:**
  1. Admin can assign prerequisites.
  2. System blocks circular dependencies.
  3. Roadmap reflects changes immediately.

**5.4 Audit log + publish model**
- **Acceptance Criteria:**
  1. Admin edits recorded with who/what/when.
  2. “Last updated” stamp updates after edits.
  3. Audit log view exists (basic table).

---
