# 12. Deployment Architecture

## 12.1 Environments
- Development
- Staging
- Production

## 12.2 Hosting (Recommended)
- **Frontend:** Vercel (or Cloud Run)
- **Backend:** Google Cloud Run (container)
- **Database:** Supabase hosted Postgres
- **Storage:** Supabase Storage

## 12.3 CI/CD (Suggested)
- GitHub Actions:
  - lint/test
  - build
  - deploy to staging on merge
  - deploy to production on tag/release

---
