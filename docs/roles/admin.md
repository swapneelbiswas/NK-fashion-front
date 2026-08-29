# System Administrator (Admin)

Route prefix: `/admin` · Home page: `/admin/summary`

Full operational, security, and catalog configuration. The System Administrator does not operate the checkout terminal or edit customer profiles — their pages are entirely about managing global business entities, access controls, and database audits.

---

## Pages

| Route | Page | Feature doc |
| --- | --- | --- |
| `summary` | Sales & Margin Dashboard (global and store-specific filters) | [Sales Dashboard](../features/common/sales-dashboard.md) |
| `locations` | Stores & Warehouses CRUD | [Location Management](../features/admin/location-management.md) |
| `products` | Product Catalog CRUD | [Product Catalog](../features/common/product-catalog.md) |
| `variants` | Specific product colors/sizes/SKUs configurations | [Variant & SKU Management](../features/common/variant-management.md) |
| `staff` | Staff accounts & store assignments CRUD | [Staff Management](../features/admin/staff-management.md) |
| `inventory` | Monitor physical, reserved, and available stock levels | [Inventory Levels](../features/common/inventory-levels.md) |
| `suppliers` | Supplier profiles & Purchase Order (PO) catalogs | [Supplier & PO Catalog](../features/common/supplier-management.md) |
| `audit-logs` | Database manual stock overrides & price edit audit trails | [Audit Logs](../features/common/audit-logs.md) |
| `acl` | Role-permission security assignment matrix | [Access Control (ACL)](../features/admin/acl.md) |

---

## What Admin *cannot* do

- Cannot create checkout transactions or scan cashier barcodes directly (restricted to POS Cashiers).
- Cannot modify customer wishlists, shipping addresses, or loyalty point adjustments directly from the public storefront.
- Does not edit local store inventory counts directly without creating an audit log trail.
