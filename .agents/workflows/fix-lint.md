---
description: How to fix common lint errors in this project
---

# Fix Common Lint Errors

## Quick Reference

### 1. `@typescript-eslint/no-explicit-any` — No `any` types
```diff
- let data: any = {};
+ let data: MyResponse = {} as MyResponse;

- getData(params: any): Observable<any> {
+ getData(params: Record<string, string>): Observable<MyResponse> {
```

### 2. `@typescript-eslint/typedef` — Missing type annotation
```diff
- const items = res.data;
+ const items: Array<MyItem> = res.data;

- let loading = false;
+ loading = false; // (at class level, no let — just omit the declaration type)
```

### 3. `no-restricted-imports` — Relative imports forbidden
```diff
- import { MyModel } from '../../models/my.model';
+ import { MyModel } from '@models/my.model';

- import { MyService } from '../services/my.service';
+ import { MyService } from '@services/my/my.service';

- import { helper } from 'app/utils/input-validation/common.validator';
+ import { helper } from '@utils/input-validation/common.validator';
```

### 4. `no-restricted-syntax` — Empty strings not allowed
```diff
- const name: string = '';
+ const name: string | null = null;
```
Use `null` instead of empty strings for initial/cleared state.

### 5. `@typescript-eslint/no-unused-vars` — Unused variables
Remove unused imports and variables. If intentionally unused, prefix with `_`:
```diff
- import { SomeUnusedModule } from '@angular/core';

- const unused: string = 'value';

- catchError((_error) => { ... })
+ catchError((_error: HttpErrorResponse) => { ... })
```

### 6. `jsdoc/require-jsdoc` — Missing JSDoc
Add JSDoc to every class method (public and private):
```diff
+ /**
+  * Loads hospital data from the API.
+  *
+  * @param branchId - Optional branch ID filter
+  * @returns void
+  */
  loadHospitals(branchId?: string): void {
```

### 7. `import/order` — Wrong import order
Imports must be grouped and alphabetized within each group:
1. Angular core (`@angular/core`, `@angular/common`, etc.)
2. Angular forms (`@angular/forms`)
3. Angular router (`@angular/router`)
4. RxJS (`rxjs`)
5. Models (`@models/*`)
6. Services (`@services/*`)
7. Shared components (`@shared-components/*`)
8. Utils (`@utils/*`)

### 8. `no-console` — `console.log` not allowed
```diff
- console.log('debug value', value);
+ // remove it, or use console.error only in error handlers:
  error: (err) => {
+   console.error('Failed to load data', err);
  }
```

### 9. Legacy structural directives — use control flow
```diff
- <div *ngIf="show">...</div>
+ @if (show) { <div>...</div> }

- <tr *ngFor="let item of items">
+ @for (item of items; track item.id) { <tr> }
```

### 10. Inline Tailwind classes
```diff
- <button class="ml-auto px-4 py-2 bg-blue-500 text-white rounded">
+ <button class="btn-add-custom">
  <!-- Then in .scss: -->
+ .btn-add-custom { @apply ml-auto px-4 py-2 bg-blue-500 text-white rounded; }
```

## Batch Fix

// turbo
Run lint to see all errors at once:
```bash
npm run lint
```

Some errors can be auto-fixed:
```bash
npx eslint --fix "src/**/*.ts"
```

> **Note**: `--fix` handles import ordering and some formatting, but type annotations, JSDoc, `any` replacements, and control flow migrations require manual fixes.
