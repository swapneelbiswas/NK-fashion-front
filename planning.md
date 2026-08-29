# Migration & Refactoring Plan: Hospital Delivery to Retail Management Platform

This document outlines the systematic refactoring plan to transform the Koyama Shokai hospital delivery Angular frontend codebase into the frontend client for the **Retail Management Platform** (featuring an Online Store, Admin Control Panel, and POS client). 

We will adapt the role and feature architecture of the old project as a template, mapping the existing modules to the equivalent retail modules.

---

## 1. Role Mapping Strategy

The old codebase defines four roles (`admin`, `leader`, `staff`, `hospital-staff`) using role-based routing prefixes and guards. We will map these directly to the retail system roles:

| Old Role | Old Route | New Retail Role | New Route | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `/admin` | **System Administrator** | `/admin` | Manages global catalog, multi-store locations, staff credentials, database audits, and suppliers. |
| **Leader** | `/leader` | **Store Manager** | `/manager` | Accesses local store sales metrics, stock counts, inter-store transfers, and local staff logs. |
| **Staff** | `/staff` | **POS Cashier / Operator** | `/pos` | Operates the cashier terminal, performs barcode scanning, splits payments, and prints receipts. |
| **Hospital Staff** | `/hospital-staff` | **Registered Customer** | `/account` | Manages registered customer profiles, wishlists, address books, order tracking, and loyalty points. |
| **Guest / Anonymous** | `/landing` | **Public Customer** | `/` | Browses the storefront homepage, product catalog, manages shopping cart, and executes checkout. |

---

## 2. Shared Infrastructure Adaptation

Before refactoring specific pages, we will adapt the shared components, services, and models.

### 2.1 Route Guard and Authentication Refactoring
* **`RoleGuard` (`src/app/routing/guards/role.guard.ts`):** Update roles checking to handle `admin`, `manager` (old `leader`), `pos` (old `staff`), and `customer` (old `hospital-staff`).
* **`PageGuard` (`src/app/routing/guards/page.guard.ts`):** Keep the server-driven ACL checks. Update permission keys to match the new retail page keys.
* **`AuthService` (`src/app/services/auth.service.ts`):** 
  * Update `login` request parameters to match the new login requirements (e.g., username/email and password for Admin/Manager, PIN/card barcode scan for POS, email/password for Customer).
  * Map response fields: numeric roles (`0` = Admin, `1` = Manager, `2` = POS, `3` = Customer).

### 2.2 Shared UI Components (`src/app/shared-components/`)
* **`Sidebar`:** Update navigation configuration data arrays to match the new page structure and permissions.
* **`DropdownService` & `app-searchable-dropdown`:** Modify `DROPDOWN_TABLE` to map to retail entities:
  * `hospitals` $\to$ `locations` (Stores/Warehouses)
  * `services` $\to$ `products` (Product listings)
  * `sets` $\to$ `variants` (Specific product sizes/colors/SKUs)
  * `options` $\to$ `suppliers`
* **`PostcodeService`:** Retain for autofilling customer checkout and shipping profile addresses.
* **Localization (`src/app/utils/ln/jp-localization.ts`):** Translate terms from Japanese hospital context (e.g., 病院, 配送, 区分) to English/Japanese retail context (e.g., Store, Product, POS, Stock, Customer).

---

## 3. Feature-by-Feature Migration Blueprint

We will repurpose the existing Angular page directories to build the equivalent retail features.

```
src/app/pages/
├── admin/               --> Admin Control Panel (Global catalog, multi-store, staff, POs, reports)
├── leader/              --> Store Manager Portal (Store metrics, local stock, transfers)
├── staff/               --> POS Cashier Terminal (Scanning, carts, payments, receipt printing)
└── hospital-staff/      --> Customer Portal (Orders list, wishlist, profile, loyalty ledger)
```

---

### 3.1 Admin Portal Refactoring (`src/app/pages/admin/`)

| Old Feature & Route | New Feature | Description | Migration Task |
| :--- | :--- | :--- | :--- |
| **`summary`** | **Dashboard** | Business overview showing sales, profit margins, low stock alerts, pending orders, and graphs. | Replace static billing text with charts (using chart libraries or SVG bars) showing revenue, margins, and low stock items. |
| **`branch`** | **Locations (Stores/Warehouses)** | CRUD for stores (retail branches) and warehouses. | Modify fields to support location type designation (`Store` vs `Warehouse`), address, and store phone contact details. |
| **`hospital`** | **Product Catalog** | CRUD for parent products, categories, subcategories, and collections. | Convert hospital details form to catalog form: Name, Description, Category/Subcategory, Brand, and tax status. |
| **`room-list`** | **Product Variants & SKUs** | CRUD for specific variant configurations (e.g., Red/Medium) under a parent product. | Modify fields to support: SKU, Barcode, Color, Size, Material, Purity (for jewelry), Price, Cost, and Weight. |
| **`leader-list`** | **Staff & Roles** | CRUD for staff accounts, store assignment, and permissions mapping. | Adapt employee form with Role designation (`Admin`, `Manager`, `POS`, `Warehouse`) and store location assignments. |
| **`service-list` / `set-list`** | **Inventory Levels** | Multi-store inventory monitoring and low-stock alerts dashboard. | Modify service/set templates to list inventory items. Show: Store/Warehouse, Variant SKU, Quantity, Reserved, and Available Stock. |
| **`option-list`** | **Suppliers & Purchase Orders** | CRUD for suppliers and managing PO documents (creation, sending, receiving stock). | Convert options list to Supplier list. Add PO wizard to generate order sheets for variants and post stock increases. |
| **`user-koyama-staff`** | **Audit Logs** | Logging database changes (e.g., manual stock overrides, price changes) for accountability. | Display audit trails: User, Action, Timestamp, Target, Old Value, and New Value. |
| **`acl`** | **Access Control** | Role-permission matrix configuration tool. | Uncomment and wire `/admin/acl` route back into `app.routes.ts`. Adapt permission keys for retail actions (e.g., `canChangeCostPrice`, `canAdjustStock`). |

---

### 3.2 POS / Cashier Portal Refactoring (`src/app/pages/staff/` $\to$ `/pos/`)

This portal requires high speed and keyboard-friendly navigation.

| Old Feature & Route | New Feature | Description | Migration Task |
| :--- | :--- | :--- | :--- |
| **`delivery-request`** | **POS Cashier Terminal** | POS checkout terminal with barcode scanner lookup, cart, coupons, and split payments. | Replace three-table delivery layout with a split layout: left side for cart list, right side for numeric keypad, customer selector, and payment actions. Add barcode listener. |
| **`completed-distribution-list`**| **Sales History** | Read-only historical sales register for auditing and thermal receipt reprint. | Refactor completed delivery list to show Sales orders, Invoice reference numbers, Date, Total, Payment Method, and Cashier ID. |
| **`incomplete-distribution-list`**| **Held Sales** | List of pending transactions that have been suspended/held to resume later. | Convert incomplete deliveries table to a list of held orders with a "Resume Sale" action button. |
| **`user-list`** | **Returns & Refunds** | Interface to locate past orders by receipt barcode and process refunds or items exchanges. | Refactor editable list to allow search by Order ID. Implement refund validation logic (prevent refunding more than purchased). |

---

### 3.3 Customer Portal Refactoring (`src/app/pages/hospital-staff/` $\to$ `/account/`)

| Old Feature & Route | New Feature | Description | Migration Task |
| :--- | :--- | :--- | :--- |
| **`after-delivery`** | **Orders Tracking** | Order history tracking showing shipping status updates from backend state machine. | Convert classification rows to Order rows showing: Order #, Order Date, Status Badge (Paid, Processing, Shipped, Delivered), and Tracking Link. |
| **`invoice-confirmation-list`**| **Wishlist** | Customer's saved wishlist of products with "Add to Cart" quick actions. | Adapt confirmation checkboxes to act as wishlist items with quick links to buy. |
| **`hospital-classification-list`**| **Address Book** | Registered shipping/billing address book management. | Convert classification/ward lists to shipping addresses (Name, Address, Phone, Postcode lookup). |
| **`option-list`** | **Loyalty & Rewards** | Points balance dashboard with loyalty points ledger (history of points earned/spent). | Convert options catalog template to a card showing loyalty points balance and a table of points logs. |

---

### 3.4 Public Portal Development (`src/app/pages/common/` & `/landing`)

The public storefront acts as the homepage and primary e-commerce customer pipeline.

1. **`landing` (Homepage):** Refactor the old login gateway landing page into the store homepage featuring hero sliders, featured categories, new arrivals, and promotional banners.
2. **`shop` (Catalog Browse):** Create a grid view listing product cards (Image, Name, Price, Brand, Quick View link). Include sidebar filters (category, price range, attributes like size/color).
3. **`product/:slug` (Product Details):** Product presentation detail page. Renders product images, variant selectors (changing color/size updates price and SKU stock availability), description, and customer reviews.
4. **`cart` & `checkout`:** 
  * Cart page handles quantity changes, item removal, and subtotal calculation.
  * Checkout page captures shipping details, coupon code validations, payment method selection, and submits order creation payload.

---

## 4. Models (Interfaces) Transformation Map

Update `src/app/models/` definitions to map the data models:

| Old Interface | New Interface | Core Fields |
| :--- | :--- | :--- |
| `Branch` | `StoreLocation` | `id`, `code`, `name`, `type` ('Store' \| 'Warehouse'), `address`, `phone` |
| `Hospital` | `Product` | `id`, `code`, `name`, `categoryId`, `brand`, `description`, `taxStatus` |
| `Room` / `Classification` | `ProductVariant` | `id`, `productId`, `sku`, `barcode`, `price`, `cost`, `color`, `size`, `weight` |
| `Service` | `InventoryItem` | `id`, `locationId`, `variantId`, `physicalQty`, `reservedQty`, `availableQty` |
| `Set` | `StockMovement` | `id`, `inventoryItemId`, `changeQty`, `beforeQty`, `afterQty`, `reason`, `userId`, `timestamp` |
| `Option` | `Supplier` | `id`, `name`, `companyName`, `email`, `phone`, `address` |
| `DeliveryRequest` | `Order` | `id`, `orderNumber`, `customerId`, `locationId`, `status`, `totalAmount`, `paymentMethod`, `createdAt` |
| `DeliveryList` | `OrderItem` | `id`, `orderId`, `variantId`, `quantity`, `unitPrice`, `discountAmount`, `taxAmount` |
