---
description: How to create a new page component
---

# Create a New Page Component

## Steps

// turbo
1. **Run the generator script** to scaffold the component:
```bash
npm run g:page <role>/<page-name>
```
Where `<role>` is `admin`, `common`, or `staff`.

Example: `npm run g:page common/delivery-summary`

2. **Open the generated `.ts` file** and set it up with proper structure:

```typescript
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MyService } from '@services/my/my.service';
import { LoaderComponent } from '@shared-components/loader/loader';
import { MyLabels } from '@utils/ln/jp-localization';

@Component({
  selector: 'app-<page-name>',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './<page-name>.html',
  styleUrl: './<page-name>.scss',
})
export class PageName implements OnInit {
  public readonly labels = MyLabels;

  loading = false;

  constructor(
    private readonly myService: MyService,
    private readonly cd: ChangeDetectorRef,
  ) {}

  /**
   * Angular lifecycle hook — loads initial data.
   */
  ngOnInit(): void {
    this.loading = true;
    this.cd.detectChanges();
    this.loadData();
  }

  /**
   * Loads data from the API.
   */
  private loadData(): void {
    this.loading = true;
    this.cd.detectChanges();
    this.myService.getData().subscribe({
      next: (res) => {
        // Store response data
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load data', err);
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }
}
```

> **If the component fires multiple concurrent API calls**, use the `loadingCount` counter pattern instead of a single boolean. See RULES.md Section 7 — "Concurrent Loading".

3. **Add a labels object** in `src/app/utils/ln/jp-localization.ts`:

```typescript
export const MyPageLabels = {
  TITLE: 'ページタイトル',
  ADD: CommonLabels.ADD,
  // ...
} as const; // ← always use "as const", no interface declaration
```

4. **Add the route constant** in `src/app/utils/constants.ts`:
   - Add the path string to the correct `*_CHILDREN` object (`ADMIN_CHILDREN`, `LEADER_CHILDREN`, or `STAFF_CHILDREN`).
   - Every role that accesses this page must have its own constant under its own `*_CHILDREN`.

5. **Register the route** in `src/app/routing/app.routes.ts`:
   - Import the component.
   - Add it to the correct children array using the `AppRoutes.*_CHILDREN` constant you just defined.

6. **Set up the HTML template** — no inline Tailwind, use semantic class names:

```html
<app-loader [visible]="loading"></app-loader>
<div class="mp-page">
  <main class="mp-main">
    <!-- Header -->
    <div class="mp-header">
      <h1 class="mp-title">{{ labels.TITLE }}</h1>
      <button class="btn-custom-blue btn-add" (click)="openCreate()">
        {{ labels.ADD }}
      </button>
    </div>

    <!-- Empty state -->
    @if (items.length === 0) {
      <p class="mp-empty">データがありません</p>
    }

    <!-- Table -->
    @for (item of items; track item.id) {
      <!-- row -->
    }
  </main>
</div>
```

7. **Define all CSS in the `.scss` file** using `@apply`:
```scss
.mp-page { @apply flex min-h-screen bg-white; }
.mp-main { @apply flex-1 p-6 overflow-hidden; }
.mp-header { @apply flex items-center mb-6; }
.mp-title { @apply text-2xl font-bold text-gray-900; }
.mp-empty { @apply text-gray-500 text-center py-6; }
```

// turbo
8. **Run lint** to verify:
```bash
npm run lint
```
