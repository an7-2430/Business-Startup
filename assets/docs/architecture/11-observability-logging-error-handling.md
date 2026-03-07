# 11. Observability, Logging, Error Handling

## 11.1 Logging
- Structured logs: request_id, user_id (if available), route, status, latency
- Integration logs include provider and external status codes

## 11.2 Error Handling
- Standard error responses with consistent shape:
```json
{ "success": false, "data": null, "error": { "code": "X", "message": "..." } }
```

---
