# 8. Non-Functional Requirements (NFR)
NFR1. Performance: dashboard initial load < 2s typical broadband.  
NFR2. Security: JWT/session validation + RBAC for admin endpoints.  
NFR3. Privacy: user documents private by default; signed URL access.  
NFR4. Reliability: timeouts/retry for external calls; structured error handling.  
NFR5. Availability: 99.5% uptime target for MVP hosting.  
NFR6. Deployability: monolith packaged for container deployment (Cloud Run ready).  
NFR7. Maintainability: clear module boundaries (auth/roadmap/admin/billing).  
NFR8. Auditability: admin edits logged (who/what/when).  
NFR9. Content integrity: “last updated” stamp visible for compliance content.  
NFR10. Cost: sandbox/demo services by default (Stripe test mode).

---
