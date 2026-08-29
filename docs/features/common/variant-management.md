# Variant & SKU Management

Products in NK Fashions exist as configurable variations. This module handles specific options like color, size, material, or metal purity under a parent product.

---

## Data Model

A `ProductVariant` consists of:
* `id` (guid): Unique identifier.
* `productId` (guid): Parent product reference.
* `sku` (string): Stock Keeping Unit (e.g. `SAR-NF-001-RED`).
* `barcode` (string): EAN-13/Code128 scan value.
* `price` (decimal): Base customer retail price.
* `cost` (decimal): Internal wholesale cost price.
* `color` (string): Option color attribute.
* `size` (string): Size attribute (e.g. `M`, `L`, `Free Size`).
* `weight` (decimal): Shipping weight calculation value.

---

## Workflows

1. **SKU Generation**: When adding variants, the system formats SKUs based on catalog standards.
2. **Barcode Assisting**: Users can either scan existing manufacturer barcodes or trigger the system to auto-generate code values for print.
3. **Price Adjustments**: Updating variant pricing instantly alters storefront listings and cashier terminals.
