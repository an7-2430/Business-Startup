# 3. Frontend Architecture (Next.js App Router)

## 3.1 Project Structure (Suggested)
```
/app
  / (landing pages)
  /login
  /onboarding
  /dashboard
  /steps/[id]
  /admin
  /billing
/components
  /ui (buttons, cards, modals, toasts)
  /roadmap (React Flow nodes/edges)
  /forms
/lib
  apiClient.ts (fetch wrapper)
  auth.ts (session helpers)
  constants.ts
/styles
```

## 3.2 UI State Model
- **Step status:** locked | unlocked | completed
- **Progress:** completed_count / total_count → percentage
- **UX patterns:** loading skeletons, toasts, error boundaries

## 3.3 Roadmap Map Rendering
- Use React Flow (or equivalent) for node-based roadmap.
- Nodes render status via color + icon.
- Clicking node opens Step Detail.
- Map supports zoom/pan; mobile uses scroll container + simplified controls.

---
