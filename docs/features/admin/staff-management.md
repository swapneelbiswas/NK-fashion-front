# Staff Management

Administrators configure credentials, roles, and location assignments for the company's workforce.

---

## Data Model

An `Employee` record contains:
* `id` (guid): Unique identifier.
* `name` (string): Full name.
* `email` (string): Primary communication and login address.
* `role` (enum): System role level (`Admin` \| `Manager` \| `POS_Cashier`).
* `assignedLocationId` (guid): Location ID the staff member is assigned to (primarily used to scope Store Managers' views).
* `active` (boolean): Flag to quickly revoke workspace login access.

---

## Workflows

1. **Staff Onboarding**: Admin registers an employee and selects their system role.
2. **Access Revocation**: Staff can be deactivated instantly by toggling `active = false`, which invalidates their login tokens.
3. **Role Enforcement**: Changing a role updates permissions instantly through JWT token claims adjustments upon their next session initialization.
