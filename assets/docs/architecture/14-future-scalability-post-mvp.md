# 14. Future Scalability (Post-MVP)

## 14.1 When to Add a Queue or Kafka
Introduce background processing only when needed:
- high volume events (emails, analytics)
- heavy jobs (imports, file processing)
- multiple services

Preferred stepping stone before Kafka:
- lightweight queue (Redis/BullMQ)
- cron jobs for maintenance tasks

---
