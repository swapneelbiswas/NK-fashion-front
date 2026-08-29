# Wishlist (Customer Portal)

The Wishlist module allows customers to save specific product variants for future purchase evaluation.

---

## Data Model

A `WishlistItem` contains:
* `id` (guid): Unique identifier.
* `customerId` (guid): Target customer record.
* `variantId` (guid): Target product variant SKU.
* `addedAt` (datetime): Timestamp.

---

## Workflows

1. **Adding to Wishlist**: Toggling the heart icon on catalog listings inserts a `WishlistItem` database record.
2. **Review Panel**: Customers view their wishlist inside the account portal.
3. **Quick-Add checkout**: Click "Add to Cart" directly from the wishlist grid, which resolves stock status and moves the variant SKU into their shopping cart.
