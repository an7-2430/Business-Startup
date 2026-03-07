# 8. Authentication & Authorization

## 8.1 Auth0
- Frontend uses Auth0 login.
- Backend validates JWT on each request.
- Roles:
  - `user`: standard access
  - `admin`: admin endpoints + CMS

## 8.2 RBAC Enforcement
- Middleware checks role for `/api/v1/admin/*` routes.
- Admin UI routes in Next.js also require role checks to prevent navigation leaks.

---
