# Specification

## Summary
**Goal:** Replace the “coming soon” admin placeholders with working CRUD editors for Sections, Products, Gallery, Contact Info, and Messages using existing canister methods and the current admin session token flow.

**Planned changes:**
- Implement functional admin pages for /admin/sections, /admin/products, /admin/gallery, /admin/contact, and /admin/messages (list/create/edit/delete as applicable).
- Add React Query mutation hooks for admin content management (sections/products/gallery/contact info/messages) and wire them into the admin pages with cache invalidation after successful mutations.
- Add consistent admin UX across editors: loading/empty/error states, add/edit forms, delete confirmation flows, and basic required-field validation; show a user-facing error when the admin token is missing/expired.

**User-visible outcome:** Admin users can manage sections, products, gallery items, contact info, and messages from their respective /admin pages (no more placeholder text), with updates reflected immediately after changes.
