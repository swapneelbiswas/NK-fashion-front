# POS Cashier / Operator

Route prefix: `/pos` · Home page: `/pos/terminal`

Front-line retail cashier terminal operations. Optimized for speed and keyboard shortcuts, this role scans product barcodes, applies coupon codes, manages split payments (cash/card), holds/resumes transactions, and issues thermal receipts.

---

## Pages

| Route | Page | Feature doc |
| --- | --- | --- |
| `terminal` | Cashier Terminal: barcode scanner input field, cart item lists, customer selector, numerical keypad, payment panel | [Cashier Terminal](../features/pos/cashier-terminal.md) |
| `sales-history` | Audit completed sales, print duplicate receipts, initiate refunds | [Sales History & Held Sales](../features/pos/sales-history.md) |
| `held-sales` | List suspended checkout transactions to resume them | [Sales History & Held Sales](../features/pos/sales-history.md) |
| `products` | Searchable product listings to lookup item prices manually | [Product Catalog](../features/common/product-catalog.md) |

---

## What POS Cashier *cannot* do

- Cannot view product wholesale cost prices or net profit margins (restricting access to retail pricing secrets).
- Cannot manually overwrite inventory stock counts (any variance adjustments must go through Store Manager approval or stocktakes).
- No access to global configs, suppliers, PO sheets, store locations, or employee accounts.
