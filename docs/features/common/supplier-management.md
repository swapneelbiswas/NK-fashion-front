# Supplier & PO Catalog

NK Fashions coordinates supply chains with designers and jewelry manufacturers. Admins manage supplier profiles and generate Purchase Orders (PO) to increase inventory stock levels.

---

## Data Model

A `Supplier` record contains:
* `id` (guid): Unique identifier.
* `name` (string): Contact representative.
* `companyName` (string): Organization name.
* `email` (string): Primary supply contact.
* `phone` (string): Contact number.
* `address` (string): Warehouse/office shipping location.

---

## Workflows

1. **Restocking Alert**: When available quantities drop below safe parameters, admins draft a PO.
2. **Purchase Order Routing**: Admins select a supplier, select variant SKUs and wholesale prices, and generate a PO sheet.
3. **Receiving Stock**: When shipment arrives, matching items are scanned, increasing `physicalQty` at the target warehouse.
