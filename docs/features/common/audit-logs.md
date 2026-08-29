# Audit Logs

For compliance and security accountability, NK Fashions logs critical system actions. This provides a digital paper trail of database alterations.

---

## Data Model

An `AuditEntry` contains:
* `id` (guid): Unique identifier.
* `userId` (guid): Employee ID initiating the change.
* `action` (string): Action flag (e.g. `PRICE_OVERRIDE`, `STOCK_OVERRIDE`, `ROLE_CHANGE`).
* `target` (string): Mapped database table/field entity (e.g., `ProductVariant:NF001:Price`).
* `oldValue` (string): Value before adjustment.
* `newValue` (string): Value after adjustment.
* `timestamp` (datetime): Exact server action time.

---

## Workflows

1. **Auto-Logging Interceptors**: Entity Framework interceptors auto-register database transactions for specified audited properties, preventing bypassed logging.
2. **Access Scoping**: Reviewing audit logs is restricted to System Administrators.
