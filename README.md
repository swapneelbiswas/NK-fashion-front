# NK Fashions — Frontend Platform

This is the Angular frontend application for the **NK Fashions** multi-channel retail management and e-commerce platform.

## Project Summary

NK Fashions integrates online storefront shopping with in-store POS checkout and multi-tier retail business administration. It is structured around five primary access roles and portals:

- **Public Storefront (`/`, `/shop`, `/product/:slug`, `/cart`, `/checkout`)**: High-conversion e-commerce catalog, faceted search/filtering, interactive product showcase, cart drawer, and guest/customer checkout.
- **Registered Customer Hub (`/account`)**: Customer profile, live order tracking, address book, wishlist, and loyalty points ledger.
- **POS Cashier Terminal (`/pos`)**: High-speed touch and barcode-scanner checkout terminal, speed keys, split tender (Cash, Card, UPI), held/parked orders, and thermal receipt printing.
- **Store Manager Portal (`/manager`)**: Local branch inventory tracking, low-stock alerts, inter-branch stock transfers, cashier audit logs, and drawer reconciliation.
- **System Administrator Center (`/admin`)**: Global analytics dashboard, multi-store/warehouse location management, central product catalog & SKU variant matrix, suppliers & purchase orders (PO), staff RBAC permissions, and immutable audit trails.

## How to Run Locally

Ensure you have your dependencies installed:

```bash
npm install
```

To start the local development server, run:

```bash
npm start
```

_(This triggers a local ESLint validation followed by `ng serve`)_

Navigate your browser to `http://localhost:4200/`. The application will automatically live-reload whenever you modify source files.

---

## Tooling & Existing Commands

The project uses tailored Node wrapper scripts to ensure strict architectural and boilerplate conventions. Always try to prefer these custom commands over generic `ng generate`:

| Command                      | Action                                                                                         |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| `npm run g:page`             | Generates a routed page component.                                                             |
| `npm run g:shared-component` | Scaffolds a generic, standalone shared UI component.                                           |
| `npm run g:service`          | Scaffolds an HTTP domain service (`@Injectable`).                                              |
| `npm run generate:models`    | Resyncs the TypeScript interfaces structurally from the backend's `rest_api.yml` OpenAPI spec. |
| `npm run lint`               | Runs the strictly-configured project ESLint suite.                                             |
| `npm run build`              | Lints and executes the production compiler (`ng build`).                                       |
| `ng test`                    | Executes local unit test runners.                                                              |

---

## Maintaining Imports

Maintaining a clean and predictable import architecture is strictly enforced by the ESLint configuration.

### 1. Path Aliases Only

**Never** use raw relative path structures (e.g., `../../models/session.model`). You **must** utilize the absolute TSConfig aliases globally configured for the app:

- `@env/*`
- `@models/*`
- `@pages/*`
- `@routing/*`
- `@services/*`
- `@shared-components/*`
- `@utils/*`

### 2. Strict Alphabetized Order

Group and space out your imports vertically in exactly the following structured order:

1. **Angular SDK** (`@angular/common`, `@angular/core`, etc.)
2. **Angular Ecosystem** (`@angular/forms`, `@angular/router`, etc.)
3. **RxJS Native** (`rxjs`, `rxjs/operators`)
4. **App Models** (`@models/*`)
5. **App Services** (`@services/*`)
6. **Shared Components** (`@shared-components/*`)
7. **Utilities and Configs** (`@utils/*`, `@env/*`)

> **Developer Note:** For detailed architectural plans, feature roadmap specifications, and domain entity mappings, consult [planning.md](./planning.md) and [RULES.md](./RULES.md).
