# Koyama Shokai — Architecture & Rules

> **Project brain file** — the single comprehensive source of truth for AI agents and developers working on this project.

## 1. Project Overview

| Key             | Value                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------------- |
| **Name**        | Koyama Shokai Angular Frontend                                                                     |
| **Framework**   | Angular 21 (Standalone components, `ChangeDetectionStrategy.OnPush`)                               |
| **Styling**     | Tailwind CSS 3 + SCSS                                                                              |
| **Language**    | TypeScript 5.9 (Strict mode, no `any`)                                                             |
| **State**       | RxJS Observables (no NgRx)                                                                         |
| **Auth**        | Cookie-based (HttpOnly), `withCredentials: true`                                                   |
| **Purpose**     | Hospital delivery request management. Staff request services/options organized into delivery jobs. |
| **UI Language** | Japanese (user-facing text `jp-localization.ts`), English (code/comments)                          |

### User Roles

| Role                   | Access Level                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| **Admin (`/admin`)**   | Full operational access. Can manage branches, hospitals, leaders, services, options, sets. |
| **Leader (`/leader`)** | Oversight view. Read-only summary lists, distribution lists, hospitals, and rooms.         |
| **Staff (`/staff`)**   | Fulfillment view. Manages core delivery requests (create/complete) and distribution lists. |

---

## 2. Prerequisites & Workflows

Before starting tasks, refer to the local workflow recipes in `.agents/workflows/`:

- `create-page.md` — Scaffolding a new page component with `npm run g:page` and hooking it up.
- `create-service.md` — Building an injectable API service.
- `create-model.md` — Generating interface definitions for the API.
- `fix-lint.md` — Resolution of project-specific ESLint errors.
- `pre-merge.md` — Checklist before pushing code.
- `git-branch.md` — Commit, checkout dev, pull, and create a new feature branch.

---

## 3. Behavioral Rules

### DO

- Use **path aliases** for all imports (`@models/*`, `@services/*`, `@pages/*`, `@utils/*`, etc.)
- Use **explicit type annotations** on all variables, parameters, and return types.
- Write **JSDoc comments** with `@param` and `@returns` on ALL class methods (public & private).
- Handle both **loading** and **error** states for every API call.
- Trigger manual **`cd.detectChanges()`** immediately after setting `loading = true` and after processing async operations.
- Always use **`withCredentials: true`** on HTTP calls.
- Use Angular **`@if` / `@for`** control flow (never `*ngIf` / `*ngFor`).
- Use **`as const`** on all label/localization objects (no explicit interface declarations).
- Keep **`loadingCount`** for components that fire multiple concurrent API calls (see Section 7).
- Always add **route constants** to the correct `*_CHILDREN` object in `constants.ts` when adding routes.

### DON'T

- ❌ Use `any` type or empty strings (`''`) — blocked by ESLint.
- ❌ Use relative imports (`./`, `../`) — blocked by ESLint. Always use path aliases.
- ❌ Leave `console.log` anywhere — use `console.error` exclusively in error handlers.
- ❌ Skip form validation checks (`markAllAsTouched()`) before form submissions.
- ❌ **Use inline Tailwind classes in HTML**. All Tailwind utility classes must be moved into `.scss` files using `@apply`.
- ❌ Edit files in `src/app/models/` manually — they are auto-generated.
- ❌ Declare explicit `interface I<Name>Labels` for localization objects — infer types via `as const`.
- ❌ Use `*ngIf` / `*ngFor` legacy directives — use `@if` / `@for` control flow.
- ❌ Use the `ng g` CLI directly — use the project's `npm run g:*` scripts instead.

---

## 4. ESLint Enforcement (`.eslintrc.json`)

| Auto-Enforced Rule ✅ | ESLint Rule                          | Category      |
| --------------------- | ------------------------------------ | ------------- |
| No `any` types        | `@typescript-eslint/no-explicit-any` | Strict Typing |
| No relative imports   | `no-restricted-imports`              | Architecture  |
| Explicit annotations  | `@typescript-eslint/typedef`         | Strict Typing |
| Mandatory JSDocs      | `jsdoc/require-jsdoc`                | Documentation |
| No `console.log()`    | `no-console`                         | Code Quality  |

_(Run `npm run lint` frequently. Patterns like `cd.detectChanges()` and `loadingCount` must be manually evaluated.)_

---

## 5. File Organization

```
src/app/
 ├── app.config.ts      # App bootstrapping (Router, HTTP client, initAuth initializer)
 ├── models/            # Auto-generated from OpenAPI. DO NOT edit manually.
 ├── routing/           # Route definitions guarded by Auth guards.
 │    └── app.routes.ts # Single routes file. All roles defined here.
 ├── services/          # Injectable async data services grouped by domain.
 │    ├── auth/         # AuthService, AuthStateService, RoleGuard, RoleRedirectGuard
 │    ├── job/          # JobService (Polling for async task completion)
 │    ├── dropdown/     # DropdownService (Global metadata fetcher)
 │    ├── branch/       # BranchService
 │    ├── delivery/     # DeliverService
 │    ├── hospital/     # HospitalService
 │    ├── leader/       # LeaderService
 │    ├── option/       # OptionService
 │    ├── room/         # RoomService
 │    ├── service/      # ServiceService
 │    ├── service_set/  # SetService
 │    ├── session/      # SessionService
 │    └── total_bill/   # TotalBillService
 ├── pages/             # Route configurations map to these standalone components:
 │    ├── admin/        # Admin-only pages (branch, leader-list)
 │    ├── staff/        # Staff-only pages (delivery-request)
 │    └── common/       # Reused across multiple roles:
 │         ├── completed-distribution-list/
 │         ├── hospital/
 │         ├── incomplete-distribution-list/
 │         ├── landing/
 │         ├── login/
 │         ├── option-list/
 │         ├── room-list/
 │         ├── service/
 │         ├── set-list/       # Drill-down from service page
 │         └── summary-list/   # Admin top / Leader summary
 ├── shared-components/ # Reusable UI components:
 │    ├── calendar/
 │    ├── confirmation-alert/
 │    ├── csv-date-range-modal/
 │    ├── delivery-table/
 │    ├── empty-sidebar/
 │    ├── error-alert/
 │    ├── error-card/
 │    ├── header/
 │    ├── loader/
 │    ├── pagination/
 │    └── sidebar/
 └── utils/
      ├── constants.ts         # Exported route paths (AppRoutes, DeliveryType, etc.)
      ├── custom_model/        # Non-API UI models (delivery-table-model.ts, total-number-model.ts)
      ├── date-time-format.ts  # Date formatting helpers (formatJapaneseDate, etc.)
      ├── dropdown/            # DROPDOWN_TABLE enum for DropdownService
      ├── global/              # Global utilities
      ├── hospital-status.util.ts
      ├── input-validation/    # Validators (maxLengthFromConfig, validation.config.ts)
      └── ln/
           └── jp-localization.ts  # Japanese UI translation map (all label objects)
```

### Path Aliases (`tsconfig.app.json`)

`@env/*`, `@interceptors/*`, `@models/*`, `@pages/*`, `@routing/*`, `@services/*`, `@shared-components/*`, `@utils/*`

---

## 6. Architecture & Subsystems

### A. Authentication & Routing Flow

- **Initialization**: `app.config.ts` fires `initAuth()` which hits `/auth/whoami` to load session data globally.
- **State Store**: `AuthStateService` stores user info in a `BehaviorSubject` dictating role-based access.
- **Guards**: `RoleGuard` secures `/admin` and `/leader` routes. The `STAFF` route currently has its guard commented out pending implementation.
- **Page Sharing**: Many routes (`/hospital`, `/service`, `/set-list`) point identically to `pages/common/*`. The sidebar adapts automatically based on the user's role payload.

### B. Route Configuration (`app.routes.ts`)

- All route path strings must be defined as constants in `AppRoutes` in `src/app/utils/constants.ts`.
- The `ADMIN_CHILDREN`, `LEADER_CHILDREN`, and `STAFF_CHILDREN` objects must each define every route that role can access — **never reuse constants from a different role's `*_CHILDREN`**.
- Route URL params use camelCase (e.g., `:serviceId`, `:hospitalId`). Component code reads them via `this.route.snapshot.paramMap.get('serviceId')`.

### C. Core Principles

- **Models**: Export only `interfaces` explicitly. Names look like `SessionListResponse`, `CreateHospitalRequest`.
- **Services**: `@Injectable({ providedIn: 'root' })`. Define backend calls using generics: `this.http.get<T>(url, { withCredentials: true })`.

---

## 7. Deep Architecture Patterns

### Localization (`jp-localization.ts`)

All user-facing strings are defined in `src/app/utils/ln/jp-localization.ts`.

- **`CommonLabels`** — shared strings reused across label objects (e.g., `ADD`, `SAVE`, `BRANCH_NAME`).
- Each page/component has a dedicated `<Name>Labels` object that references `CommonLabels` where applicable.
- **Do NOT declare explicit interfaces** for label objects (e.g., no `interface IMyLabels`). Instead, export `as const` on the object itself — TypeScript infers the literal types automatically.

```typescript
// ✅ Correct
export const MyPageLabels = {
  TITLE: 'タイトル',
  ADD: CommonLabels.ADD,
} as const;

// ❌ Wrong — redundant interface
export interface IMyPageLabels { TITLE: string; }
export const MyPageLabels: IMyPageLabels = { ... };
```

### Change Detection & State Management (`OnPush`)

Manually invoke `this.cd.detectChanges()` after any async state update.

**`NG0100 Workaround`**: When updating UI state inside a `valueChanges` subscription, wrap in a macro-task:

```typescript
this.myService.getData().subscribe((data) => {
  setTimeout(() => {
    this.tableData = data;
    this.cd.detectChanges();
  });
});
```

### Concurrent Loading — `loadingCount` Pattern

When a component fires **multiple independent API calls simultaneously** (e.g., `loadData()` + `loadTotalBills()`), a single boolean `loading` flag creates a race condition — the first call to finish hides the spinner while other calls are still in flight.

**Use a counter instead:**

```typescript
loading = false;
private loadingCount = 0; // counts in-flight requests; spinner shows until 0

loadEverything(): void {
  this.loadingCount = 2; // match number of calls
  this.loading = true;
  this.cd.detectChanges();
  this.loadData();
  this.loadTotals();
}

private loadData(): void {
  this.loadingCount++;
  this.loading = true;
  this.myService.getItems().subscribe({
    next: (res) => {
      this.items = res.data;
      this.loadingCount--;
      this.loading = this.loadingCount > 0; // only hide when ALL done
      this.cd.detectChanges();
    },
    error: (err) => {
      console.error(err);
      this.loadingCount--;
      this.loading = this.loadingCount > 0;
      this.cd.detectChanges();
    },
  });
}
```

**Components currently using this pattern:**
- `summary-list.ts` — `loadCompletedDeliveries()` + `loadTotalBills()`
- `delivery-request.ts` — `loadDeliveryRequest(1)` + `(2)` + `(3)`

### Single-Request API Call & Error Pattern

For components with only one in-flight request at a time:

```typescript
loadData(): void {
  this.loading = true;
  this.cd.detectChanges();
  this.myService.getData(this.id).subscribe({
    next: (res) => {
      this.data = res.items ?? [];
      this.loading = false;
      this.cd.detectChanges();
    },
    error: (err) => {
      const statusCode = Number(err.error?.status || err.status);
      this.loading = false;

      if (statusCode === 403 || statusCode === 502) {
        // Major Error: Card overlay
        this.cardErrorText = err.error?.message;
      } else {
        // Minor Error: Localized flash popup (auto-dismiss after 3s)
        this.popupErrorText = err.error?.message || '取得に失敗しました';
        setTimeout(() => { this.popupErrorText = null; this.cd.detectChanges(); }, 3000);
      }
      this.cd.detectChanges();
    },
  });
}
```

### The "Job Polling" Background Pattern

Create/Update APIs often return a `job_id`. Hand off execution to `pollJobUntilDone`:

```typescript
this.someService.create(payload).subscribe({
  next: (res) => {
    this.jobService.pollJobUntilDone(res.job_id).subscribe(() => {
      this.loading = false;
      this.closeModal();
      this.loadData();
    });
  },
});
```

### The Dropdown Pattern

Don't create raw GET endpoints for select menus. Route through:
`this.dropdownService.getDropDownList(DROPDOWN_TABLE.SERVICE).subscribe(res => ...)`

### Form Handling

- Rely entirely on `ReactiveFormsModule`.
- Init strictly via `private initForm()` inside `ngOnInit`.
- Apply custom validators from `utils/input-validation/`. Check `form.invalid` + `markAllAsTouched()` to trigger red validation feedback.

### Pagination Pattern

The shared `<app-pagination>` component handles all pagination UI. Pages must track:

```typescript
currentPage = 1;
pageSize = 10;
totalItems = 0;
totalPages = 0;
```

Wire up in template:
```html
<app-pagination
  [currentPage]="currentPage"
  [pageSize]="pageSize"
  [totalPages]="totalPages"
  (pageChange)="changePage($event)"
  (pageSizeChange)="changePageSize($event)"
></app-pagination>
```

The pagination component shows up to **3 middle pages** in its sliding window, always rendering dedicated first/last page buttons. The first page button is always shown when `totalPages >= 1`.

### HTML / Template Declarations

- `@if` / `@for` native control blocks — `@for (item of items; track item.id)`.
- Ensure an `@if (items.length === 0)` fallback exists.
- **Strict Styling Separation**: No inline Tailwind utility classes allowed in `.html`. Create semantic CSS class names (e.g., `class="modal-backdrop"`) and map them in `.scss` via `@apply`.

---

## 8. Specific Flows

### Staff Delivery Request (`delivery-request`)

- Employs tripartite table mapping: **TODAY**, **TOMORROW**, **DAY_AFTER_TOMORROW**.
- Loads all three sections concurrently via `loadDeliveryRequest(1)`, `(2)`, `(3)` — uses `loadingCount` pattern.
- Receives heavily nested structures from API. Uses local `flattenDeliveryRequests()` to produce `FlattenedDeliveryRow[]` for `app-delivery-table`.
- `DeliveryType` (`1|2|3|4`) maps to `DELIVERY_SECTION_KEYS` for the API section key string.

### Admin Summary List (`summary-list`)

- Fires `loadCompletedDeliveries()` + `loadTotalBills()` concurrently — uses `loadingCount` pattern.
- Uses `flattenResponse()` to produce `FlattenedCompletedRow[]` for the table.
- CSV export triggered via `csv-date-range-modal` shared component.

### Admin Set List (`set-list`)

- Drill-down from the Service page. Route param is `:serviceId`.
- Read via `this.route.snapshot.paramMap.get('serviceId')` (note: old typo `:seviceID` has been corrected).
- Uses `SetService.getAllSetsByService()` which maps `total_count / limit` to compute `total_pages` internally.

---

## 9. Naming & Styling Conventions

- **Files**: kebab-case (`system.config.ts`)
- **Classes/Interfaces**: PascalCase (`SystemConfig`)
- **Variables/Methods**: camelCase (`initSystem()`)
- **Constants**: UPPER_SNAKE (`MAX_RETRY_COUNT`)
- **Component Selectors**: app-prefix (`app-delivery-table`)
- **CSS Classes**: BEM-like semantic names scoped to the component (e.g., `.sl-header`, `.sl-filter-row`, `.sl-add-btn`).
- **Tailwind & CSS**: Do not write utility classes inline in HTML. Define semantic classes and declare them exclusively inside `.scss` files using Tailwind's `@apply`.

---

## 10. CLI Tooling & Code Generation

Do not manually copy-paste boilerplates. Use the tailored Node scripts that enforce our architectural rules.

### Core Scripts

| Command                           | Action                                                   |
| --------------------------------- | -------------------------------------------------------- |
| `npm run start`                   | Serve locally with the dev server.                       |
| `npm run build`                   | Production build (run before merging).                   |
| `npm run lint`                    | Run the strict ESLint checker.                           |
| `npm run generate:models`         | Regenerate `src/app/models/` from `rest_api.yml`.        |

### Component & Architecture Generators (The `scripts/` folder)

**Do NOT use bare `ng generate`**. Use these instead:

- `npm run g:page` — Generates a routed page component. Prompts for subfolder (`admin`, `staff`, or `common`) and component name.
- `npm run g:shared-component` — Scaffolds a standalone component under `src/app/shared-components`.
- `npm run g:service` — Scaffolds an `@Injectable` HTTP service scoped to a domain.
- `npm run g:interceptor` — Scaffolds HTTP interceptors.

### Model Generation Pipeline (`generate_models.ts`)

**DO NOT MANUALLY EDIT FILES IN `src/app/models/`.**

1. Replace `rest_api.yml` whenever the API structure changes.
2. Run **`npm run generate:models`**.
3. _What happens_: `openapi-generator-cli` builds raw classes in `/src/app/api/`. The custom `generate_models.ts` parser then peels `$ref` structures, converts endpoints to `<Domain>Response` items, extracts raw TS `interfaces`, outputs them to `/src/app/models/`, and deletes `/src/app/api/`.
4. Import the new strictly-typed interfaces in your UI code.
