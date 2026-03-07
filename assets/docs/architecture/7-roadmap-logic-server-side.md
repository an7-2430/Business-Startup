# 7. Roadmap Logic (Server-Side)

## 7.1 Step Status Computation
For a given user + roadmap:
- Default all steps to **locked**
- For steps with **no prerequisites** → set to **unlocked**
- For steps whose prerequisites are **all completed** → set to **unlocked**
- Completed steps remain **completed**

Status must be computed server-side to ensure consistency across devices.

## 7.2 Progress Computation
- `progress_percent = completed_steps / total_steps * 100`
- Provide counts for UI: completed, total, remaining

---
