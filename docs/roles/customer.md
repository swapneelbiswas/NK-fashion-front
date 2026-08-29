# Registered Customer

Route prefix: `/account` · Home page: `/account/orders`

Customer profile portal for registered buyers of NK Fashions. This interface allows them to review order histories, track shipments, maintain shipping address books, organize wishlists, and check loyalty points balances.

---

## Pages

| Route | Page | Feature doc |
| --- | --- | --- |
| `orders` | Order History list with status stages (Processing, Shipped, Delivered) and tracking numbers | [Orders Tracking](../features/customer/order-tracking.md) |
| `addresses` | Manage shipping and billing addresses | [Address Book](../features/customer/address-book.md) |
| `wishlist` | Review saved items with quick links to purchase | [Wishlist](../features/customer/wishlist.md) |
| `loyalty` | Loyalty points dashboard showing current balance and points history ledger | [Online Store Features](../retail_platform_specs.md#module-1-online-store-customer-facing) |

---

## What Registered Customer *cannot* do

- Cannot access any administrative dashboard, store manager panels, or POS register interfaces.
- Cannot adjust inventory quantities, product base prices, or supplier catalogs.
- Cannot view database logs or audits.
