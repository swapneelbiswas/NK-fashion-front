# Authentication, Routing & Roles

## Overview

Authentication is cookie-based (`HttpOnly`, `withCredentials: true`) — the frontend never stores a token itself. There are four system roles: `admin` (System Administrator), `manager` (Store Manager), `pos` (POS Cashier), and `customer` (Registered Customer).

---

## Login flow

The login page lives at `/login/:userType`, where `:userType` is one of `admin | leader | staff | hospital-staff` (internally mapped in the codebase as `admin | manager | pos | customer` in the retail context). This parameter serves as a UI layout and configuration hint.

* **Admin / Manager / Customer**: Form requires `email` + `password`.
* **POS Cashier**: Form requires selecting a Store Location, then entering their Cashier PIN code.

On submit, `AuthService.loginApi()` posts to `/auth/login` with credentials. The roles are mapped to numeric `role_id` strings:
* Admin $\to$ `'0'`
* Manager $\to$ `'1'`
* POS Cashier $\to$ `'2'`
* Customer $\to$ `'3'`

The backend sets the session cookie and returns `role`, `user_name`, `login_id`, plus a `permission` object (`allowed_actions`, `allowed_pages`). On success, the app routes to:

| Role | Home route |
| --- | --- |
| System Admin | `/admin/summary` |
| Store Manager | `/manager/summary` |
| POS Cashier | `/pos/terminal` |
| Registered Customer | `/account/orders` |

---

## Session restore on page refresh

An app initializer calls `AuthService.me()` $\to$ `GET /auth/whoami` on bootstrap. This resolves the same `AuthState` shape (role, allowed pages/actions, assigned location ids) from the session cookie. `RoleRouteEnforcer` handles post-bootstrap route redirects (e.g. redirecting logged-in users away from the public storefront homepage or login routes).

---

## Guards

* **`RoleGuard`**: Applied to `/admin`, `/manager`, `/pos`, and `/account`. Redirects unauthenticated sessions or redirects mismatched roles to their correct homes.
* **`GuestGuard`**: Applied to public guest pages and login pages to redirect already logged-in users.
* **`PageGuard`**: Applied to child routes to verify permissions against `allowedPages` arrays. If missing, redirects to sibling paths.

---

## Permissions (ACL) model

Role permissions are server-driven. Each route's `data: { page: '...' }` key in `app.routes.ts` is checked against the user's `allowedPages` array, which integrates with the [ACL Page](../admin/acl.md).
