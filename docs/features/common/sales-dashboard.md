# Sales Dashboard

This module consolidates sales data to provide admins and managers with actionable insights on revenue, stock alert states, and net margins.

---

## Layout

1. **Top KPI Cards**: Total Revenue, Profit Margins, Active Cashiers count, Held Checkout Transactions count.
2. **Interactive Charting Area**: Daily/weekly sales charts, margin distributions, and product category trends.
3. **Alert Banner Grid**: Highlights items that are low in stock or pending transfer updates.

---

## Scope Restraints

* **Store Manager Scope**: Auto-filtered to metrics matching `assignedLocationId`. Cannot toggle calculations for global statistics.
* **System Admin Scope**: Full view of global metrics, with dropdowns to isolate indicators by specific store locations or central warehouses.
