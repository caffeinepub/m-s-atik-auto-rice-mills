# Specification

## Summary
**Goal:** Roll back the deployed app to Version 19 and prevent users from getting stuck on the homepage “Backend Unreachable” screen during transient backend startup.

**Planned changes:**
- Rebuild and redeploy the application as Version 19, ensuring the existing build version label reports “19”.
- Adjust the homepage startup connectivity flow to automatically retry backend health/connectivity checks for a short window before showing the final “Backend Unreachable” state.
- Keep existing “Try Again” and “Reload Page” actions functioning to trigger a fresh connectivity check.

**User-visible outcome:** The public homepage loads normally without immediately showing “Backend Unreachable” under normal conditions, and if the backend is briefly slow to wake, the app retries automatically before showing an error; admin routes continue to work on Version 19.
