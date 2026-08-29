# Sales History & Held Sales

POS cashiers audit previous store transactions and manage suspended sales.

---

## 1. Sales History

Lists past store checkouts. Used to handle duplicates and customer returns.
* **Fields**: Transaction Invoice #, Date/Time, Total, Payment Method, Cashier ID.
* **Returns & Refunds**: Cashiers scan past receipts, select items to refund, and specify cash/card return types, which triggers stock increase logs.

---

## 2. Held Sales

Lists checkout checkouts that cashiers suspended (e.g. if customer wants to retrieve another item).
* **Fields**: Held Reference ID, Time, Cashier, Cart Items summary.
* **Resume Workflow**: Tapping "Resume Sale" loads the saved cart items back into the cashier terminal, updating active checkout registers.
