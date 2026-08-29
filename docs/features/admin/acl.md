# Access Control (ACL)

**Page:** `/admin/acl` · **Role:** System Admin only — **currently unrouted** (built but unrouted in `app.routes.ts`)

ACL is a role-vs-permission matrix. Each role (`role_id` 0–3, representing System Admin, Store Manager, POS Cashier, and Registered Customer) has an `allowed_pages` list and an `allowed_actions` list. These are the same keys used by `PageGuard` route definitions and sidebar menu filtering.

---

## What the page does

Two tables are rendered — one for page permissions, one for action permissions — with roles as columns and all known page/action keys as rows. Each cell is a checkbox reflecting whether that role currently has that permission. Toggling a checkbox immediately updates the backend (`POST`/`DELETE /acl/add_page`, `/acl/remove_page`, `/acl/add_action`, `/acl/remove_action`). Modals allow registering new page or action permission keys against roles.

---

## Current status

The component, template, styles, service, and model are fully functional. However, both the component import and its route entry are commented out in `src/app/routing/app.routes.ts`. It compiles and works if uncommented and wired back in.

---

## Data source

* `AclService.getAllPermissions()` → `GET /acl/get_all_permissions`, returning `AclPermissionItem[]` (`role_id`, `role_name`, `allowed_actions[]`, `allowed_pages[]`).
