# 7. Functional Requirements (FR)
FR1. User can sign up/login via Auth0 and maintain session.  
FR2. User selects industry + state (MVP: Cabinet Manufacturing, NSW).  
FR3. System generates roadmap (stages + steps) for selection.  
FR4. Step dependency logic supports locked/unlocked/completed.  
FR5. User can mark steps complete; progress % updates.  
FR6. Step detail includes instructions, links, required docs, checklist.  
FR7. User uploads/downloads documents per step (private).  
FR8. Show basic equipment/software recommendations per stage (MVP list).  
FR9. Admin CRUD industries/stages/steps/prerequisites (DB-driven).  
FR10. Admin edits update content without redeploy.  
FR11. Billing placeholder + Stripe test checkout (MVP).  
FR12. Onboarding walkthrough.

**Integration-ready requirement (global):** third-party calls must be implemented through backend routes with placeholders, webhooks, and environment-based credentials so launch does not require re-integration.

---
