# Epic 4 — Step Detail + Documents

## Goal
Let users view step details, manage notes, and upload required documents securely.

## Stories
**4.1 Step detail view**
- **Acceptance Criteria:**
  1. Step detail page loads by step id.
  2. Shows checklist, resources links, and prerequisites summary.
  3. Shows status and completion CTA.

**4.2 Step notes**
- **Acceptance Criteria:**
  1. Users can create/edit notes per step.
  2. Notes persist and reload correctly.
  3. Notes are private to the user.

**4.3 Document upload (private)**
- **Acceptance Criteria:**
  1. User uploads a document for a step.
  2. Document is private (access controlled).
  3. User can download/delete their document.

**4.4 Storage adapter + signed URLs**
- **Acceptance Criteria:**
  1. Storage adapter abstraction exists.
  2. Upload uses signed URL flow.
  3. Download uses signed URL flow.

---
