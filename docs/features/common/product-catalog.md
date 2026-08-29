# Product Catalog

This module handles parent products, categories, subcategories, and brands in the NK Fashions inventory system.

---

## Data Model

A `Product` consists of:
* `id` (guid): Unique identifier.
* `code` (string): Standardized catalog code (e.g. `PR-SAREE-RED`).
* `name` (string): Product title.
* `description` (string): Rich text description.
* `categoryId` (guid): Mapped Category (e.g., Clothing, Accessories).
* `brand` (string): Brand label (e.g., Babu Mosai, NK Signature).
* `taxStatus` (enum): Mapped VAT/GST calculation rules.

---

## Workflows

1. **Catalog Definition**: Admin creates parent categories and assigns products.
2. **Variant Drills**: Once a base product is saved, users can add specific variant records under it (e.g., sizes or colors).
3. **Public Storefront Browse**: Products are rendered as cards with brand and description tags on the online catalog pages.
