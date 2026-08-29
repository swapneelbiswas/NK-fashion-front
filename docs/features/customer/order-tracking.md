# Orders Tracking (Customer Portal)

Registered customers track their shopping purchases and order delivery states from this panel.

---

## Data Model

An `Order` consists of:
* `id` (guid): Unique identifier.
* `orderNumber` (string): Human-readable code (e.g. `NF-2026-8809`).
* `customerId` (guid): Target customer record.
* `status` (enum): Delivery status stages (`Pending` \| `Processing` \| `Shipped` \| `Delivered` \| `Returned` \| `Refunded`).
* `totalAmount` (decimal): Order total.
* `trackingNumber` (string): Courier reference number.
* `createdAt` (datetime): Timestamp.

---

## Workflows

1. **Status Progression**: When warehouse staff packages and ships an order, the status increments to `Shipped` and updates the courier tracking number.
2. **Dashboard Render**: Customers view a dashboard showing active purchases, courier tracking links, and duplicate receipt download links.
