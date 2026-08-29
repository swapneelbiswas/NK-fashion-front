# Shared UI Components & Utilities

Components and utilities shared across multiple user portals.

---

## 1. Sidebar & Header
The navigation sidebar displays menu candidates matching the logged-in user's role and filters links based on their `allowedPages` permissions. It handles:
- Grouping candidate items.
- Icon-only collapse states (automatic on screens under 768px).
- Navigation logout dispatchers.

* **Top Header**: Renders the **NK Fashions** logo, search access, account login dropdowns, and the sliding shopping cart drawer trigger.

---

## 2. Sliding Cart Drawer
A global cart drawer that slides in from the right when an item is added or when clicking the cart icon. Displays current selections, lets users adjust quantities, and directs them to checkout.

---

## 3. Dropdown Pattern
`DROPDOWN_TABLE` enumerates selectable database tables for dynamic lookup:
- `locations` (Stores/Warehouses)
- `products` (Parent products)
- `variants` (SKUs/sizes/colors)
- `suppliers` (Supplier listings)
- `customers` (Customer profiles)

`DropdownService.getDropDownList()` queries paginated results dynamically.

---

## 4. Notifications & Modals
* **Toaster**: Transient success/error actions alerts.
* **error-card**: Full-screen overlay card routing session expiration redirects.
* **confirmation-alert**: Warning popup gating deletion or transfer completions.
* **loader**: Spinning overlay blocking inputs during active API calls.

---

## 5. Input Validation & Form Directives
* Centralized length restrictions (titles, descriptions, SKUs).
* Form validation rules (email patterns, matching passwords).
* **HalfWidthInputDirective**: Formats numeric text entries (PIN fields, quantity inputs).

---

## 6. Postcode Lookup
`PostcodeService` hits address resolution APIs to auto-fill Prefecture/City fields based on entered postal codes in customer address books.
