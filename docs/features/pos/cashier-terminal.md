# Cashier Terminal (POS)

The POS cashier interface is optimized for high-speed counter transactions, keyboard actions, and barcode scanner inputs.

---

## Layout

A split terminal screen contains:
1. **Left Cart Panel**: Grid showing items in the checkout cart, quantities, retail prices, discounts, and line totals.
2. **Right Action Pad**:
   - Customer selector and search field.
   - Numerical input keypad (speeds up manual price/qty entries).
   - Coupon codes field.
   - **Payment Panel**: Split buttons for Payment type (`Cash` \| `Card` \| `Split Payment`).

---

## Workflows

1. **Barcode Scanner Listener**: The terminal listens to window keyboard events. When it detects rapid numeric entry ending in `Enter`, it queries variant lookup endpoints, adding items to the cart.
2. **Split Payments**: If a customer pays part cash, part credit card, the cashier specifies cash input; the terminal computes card balance dues and tracks the transaction split.
3. **Transaction Completion**: Finalizing transaction calls `/api/orders/pos/checkout`, updating physical inventory stock and printing to the receipt printer.
