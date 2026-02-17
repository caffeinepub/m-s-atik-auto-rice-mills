# Specification

## Summary
**Goal:** Prevent admin authentication flows from breaking when the backend canister is stopped by showing clear English errors and restoring the UI to a usable state.

**Planned changes:**
- Detect replica rejection errors indicating a stopped canister (IC0508 / reject code 5 / “canister is stopped”) during Admin Login and display a clear English “service temporarily unavailable” message instead of a generic error.
- Ensure the Admin Login submit flow exits loading state on these errors and avoids uncaught exceptions (optionally a single controlled console log).
- Update admin route gating (token validation) to recognize IC0508/canister-stopped errors, show an English “admin backend unavailable” session error, and avoid clearing an otherwise valid stored admin token in this case.
- Standardize parsing/extraction of replica rejection details (error_code, reject_code, reject_message) from thrown errors so admin login and token validation produce consistent English messaging across stopped-canister vs invalid credentials vs unauthorized/expired token cases.

**User-visible outcome:** If the backend canister is stopped, admins see a clear English message that the service is temporarily unavailable; the login page/admin gating remains responsive and does not get stuck loading, and valid sessions are not unnecessarily cleared.
