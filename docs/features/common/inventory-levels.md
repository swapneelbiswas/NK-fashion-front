# Inventory Levels

This module manages the real-time physical, reserved, and available quantities of product variants at specific store and warehouse locations.

---

## Data Model

An `InventoryItem` contains:
* `id` (guid): Unique identifier.
* `locationId` (guid): Store or warehouse reference.
* `variantId` (guid): Product variant SKU reference.
* `physicalQty` (int): Total stock physically present.
* `reservedQty` (int): Stock held by active cart checkouts.
* `availableQty` (int): Sellable stock (`physicalQty - reservedQty`).

---

## Workflows

1. **Stock Booking / Reservations**: Online checkouts temporarily increment `reservedQty`. If order payment fails or expires, stock reserves release. Upon order packing, `physicalQty` and `reservedQty` both decrement.
2. **Manual Adjustments (Stocktake)**: Managers edit quantities for audits, generating an entry in the stock ledger.
3. **Inter-Store Transfers**: Managers draft a transfer sheet, subtracting stock from the source location and marking it "In Transit" until received at the destination location.
