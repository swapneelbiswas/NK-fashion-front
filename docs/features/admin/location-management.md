# Location Management (Stores & Warehouses)

System Administrators manage the physical nodes of the retail distribution network using this module. The system distinguishes between customer-facing retail **Stores** and fulfillment **Warehouses**.

---

## Data Model

An `InventoryLocation` consists of:
* `id` (guid): Unique identifier.
* `code` (string): Short identifier code (e.g. `ST-001`, `WH-CENTRAL`).
* `name` (string): Human-readable name.
* `type` (enum): Location type Designation (`Store` \| `Warehouse`).
* `address` (string): Full shipping street address.
* `phone` (string): Contact number.
* `managerId` (guid): Associated Employee ID acting as manager.

---

## Workflows

1. **Creating a Store/Warehouse**: Admin specifies details and assigns a Store Manager.
2. **Inventory Scope Allocation**: Saving a location automatically enables it to hold stock levels for variants, initializing empty mapped `InventoryItem` records.
3. **Audit Log Integration**: Changes to location properties are registered in global audit logs.
