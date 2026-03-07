# 4. Backend Architecture (Node.js REST)

## 4.1 Service Structure (Suggested)
```
/src
  /config (env, constants)
  /middleware (auth, rbac, error handler)
  /modules
    /profile
    /onboarding
    /roadmap
    /steps
    /documents
    /admin
    /payments
    /webhooks
    /integrations
  /utils (logger, validation, http client)
  server.ts
```

## 4.2 Core Middleware
- **Auth middleware:** verifies Auth0 JWT / session token
- **RBAC middleware:** checks roles (admin)
- **Validation:** schema validation for request bodies
- **Error handler:** standardized errors + logging

## 4.3 Integrations Layer (Adapter Pattern)
All third-party calls go through a provider adapter to keep switching costs low:
- `integrations/auth0/*`
- `integrations/stripe/*`
- `integrations/storage/*`

---
