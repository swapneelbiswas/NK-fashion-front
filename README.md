# Koyama Shokai Frontend

This is the Angular frontend application for the Koyama Shokai hospital delivery request management system.

## Project Summary

This application serves as a fulfillment and oversight portal organizing delivery jobs (such as linen and patient items requests). It is structured around three primary access roles:

- **Admin**: Full operational management (Branches, Hospitals, Services, Options, Sets).
- **Leader**: Data oversight (Summary tables and distribution views).
- **Staff**: Fulfillment engine (Creation, processing, and completion of user delivery requests).

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

> **Developer Note:** For extremely comprehensive architectural blueprints, state management requirements (such as ChangeDetection and Job Polling), and structural rules, you must consult the [RULES.md](./RULES.md) brain-file located in the root directory.
