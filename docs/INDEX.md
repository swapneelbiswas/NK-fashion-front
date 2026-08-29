# NK Fashions Frontend — Documentation

This folder documents the **NK Fashions** retail boutique and POS management platform from two angles:

- **[roles/](roles/)** — what each user role (System Admin, Store Manager, POS Cashier, Customer) can see and do, page by page.
- **[features/](features/)** — how each retail feature works end-to-end (data model, sales transactions, inventory ledger), organized by the role that primarily owns it.

For coding conventions, architecture patterns, and generator scripts, see [`RULES.md`](../RULES.md) at the project root — that file remains the source of truth for *how to build* things. This `docs/` folder explains *what the retail system does* and *for whom*.

- **[Boutique Design Plan](boutique_design_plan.md)** — visual analysis and storefront design plan inspired by Dheu.in.

---

## Workflows

Step-by-step recipes for common development tasks are located in [`.agents/workflows/`](../.agents/workflows/):

| Workflow | Use it for |
| --- | --- |
| [create-page.md](../.agents/workflows/create-page.md) | Scaffolding a new page component with `npm run g:page` and hooking it up. |
| [create-service.md](../.agents/workflows/create-service.md) | Building an injectable API service. |
| [create-model.md](../.agents/workflows/create-model.md) | Generating interface definitions for the API. |
| [fix-lint.md](../.agents/workflows/fix-lint.md) | Resolving project-specific ESLint errors. |
| [pre-merge.md](../.agents/workflows/pre-merge.md) | Checklist before pushing code. |
| [git-branch.md](../.agents/workflows/git-branch.md) | Commit, checkout dev, pull, and create a new feature branch. |

---

## The business, in one paragraph

**NK Fashions** is an ethnic designer boutique specializing in premium clothing (sarees, dhoti-kurta sets) and fashion jewelry. The platform manages inventory across multiple retail store locations and central warehouses. Products are defined with flexible attributes (color, size, fabric, metal purity) and mapped to specific variants (SKUs) with distinct pricing. The system prevents double-selling stock during concurrent online checkouts and POS register scans by separating physical, reserved, and available quantities. System Administrators manage catalog entities, staff assignments, and audit trails; Store Managers monitor metrics and transfers; POS Cashiers checkout customers using barcode scans; and Registered Customers track their orders, wishlists, address books, and loyalty points.

---

## Roles

| Role | Route prefix | Summary |
| --- | --- | --- |
| [Admin](roles/admin.md) | `/admin` | System Administrator: Full catalog, multi-store configurations, employee assignments, security ACL, and audit logs. |
| [Manager](roles/manager.md) | `/manager` | Store Manager: Store-scoped stock control, inter-store transfers, and sales metrics dashboards. |
| [POS Cashier](roles/pos.md) | `/pos` | Cashier Operator: Fast terminal operations, barcode scanner integrations, split payments, and receipt printing. |
| [Customer](roles/customer.md) | `/account` | Registered Customer: Online account portal, order status history, address books, wishlists, and loyalty balance ledgers. |

---

## Features

Features are organized into sub-folders matching who primarily owns or manages them. General features (authentication, products, inventory) live under `common/`.

### 🔐 Common (all roles)

| Feature | Used by |
| --- | --- |
| [Authentication & Login](features/common/authentication.md) | Everyone (customer sign-up, cashier PIN scan, staff passwords) |
| [Product Catalog](features/common/product-catalog.md) | Admin, Manager, POS, Public Customer |
| [Variant & SKU Management](features/common/variant-management.md) | Admin, Manager, POS |
| [Inventory Levels](features/common/inventory-levels.md) | Admin, Manager, POS (physical/reserved/available stock) |
| [Supplier & PO Catalog](features/common/supplier-management.md) | Admin (purchase orders, supply chains) |
| [Sales Dashboard](features/common/sales-dashboard.md) | Admin, Manager |
| [Audit Logs](features/common/audit-logs.md) | Admin (database overrides, price edits, staff audits) |

### 🛍️ Customer Portal

| Feature | Used by |
| --- | --- |
| [Orders Tracking](features/customer/order-tracking.md) | Registered Customer |
| [Address Book](features/customer/address-book.md) | Registered Customer |
| [Wishlist](features/customer/wishlist.md) | Registered Customer |

### 🛒 POS Terminal

| Feature | Used by |
| --- | --- |
| [Cashier Terminal](features/pos/cashier-terminal.md) | POS Cashier |
| [Sales History & Held Sales](features/pos/sales-history.md) | POS Cashier, Manager |

### ⚙️ System Admin

| Feature | Used by |
| --- | --- |
| [Location Management](features/admin/location-management.md) | Admin |
| [Staff Management](features/admin/staff-management.md) | Admin |
| [Access Control (ACL)](features/admin/acl.md) | Admin |

### 🧩 Shared UI

| Feature | Used by |
| --- | --- |
| [Shared UI Components](features/shared/shared-components.md) | Everyone (Announcement bar, sticky navigation, sliding cart drawer) |
