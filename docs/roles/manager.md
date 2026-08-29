# Store Manager

Route prefix: `/manager` · Home page: `/manager/summary`

Provides store-scoped oversight: monitoring sales metrics, local stock levels, initiating inter-store stock transfers, and auditing cashiers — but excludes global catalog configuration and access control matrices (which are Admin-only).

---

## Pages

| Route | Page | Feature doc |
| --- | --- | --- |
| `summary` | Store Sales Dashboard (local revenue, margins, and cashier performance metrics) | [Sales Dashboard](../features/common/sales-dashboard.md) |
| `inventory` | Store stock levels, alert parameters, and manual counts | [Inventory Levels](../features/common/inventory-levels.md) |
| `transfers` | Create/approve stock transfers between stores and warehouses | [Inventory Levels](../features/common/inventory-levels.md) |
| `staff-logs` | Read cashier transaction overrides and sales histories | [Audit Logs](../features/common/audit-logs.md) |
| `products` | Read-only access to products and categories catalog | [Product Catalog](../features/common/product-catalog.md) |
| `variants` | Read-only details of sizes, colors, SKU definitions | [Variant & SKU Management](../features/common/variant-management.md) |
| `suppliers` | Supplier details catalog | [Supplier & PO Catalog](../features/common/supplier-management.md) |

---

## What Store Manager *cannot* do

- Cannot modify global prices, add products, or edit variant descriptions (restricted to Admin).
- Cannot change staff roles, modify system security settings, or edit the permission matrix (ACL).
- Cannot scan barcodes to process general sales transactions unless switching to a POS terminal login session.
