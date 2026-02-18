# Specification

## Summary
**Goal:** Restore the last known working deployed version as the primary production experience, keep the currently deployed broken version accessible for troubleshooting, and add rollback safety signals and error handling so users never see a blank/broken screen.

**Planned changes:**
- Roll production back to the last known working deployment while preserving the currently deployed (broken) version as a separately accessible path for troubleshooting.
- Add a small, non-intrusive build/version identifier on all public pages (e.g., footer) and on the admin login screen, using English text.
- Add frontend startup and runtime safety handling: show a clear English error screen when the backend is unreachable or a fatal runtime error occurs, with a deterministic recovery action (Reload / Try Again).

**User-visible outcome:** The site loads normally again in production, testers can verify which version they’re viewing via a visible version label, the broken build remains reachable via a separate access path for debugging, and users see a clear recoverable error screen instead of a blank page if startup fails.
