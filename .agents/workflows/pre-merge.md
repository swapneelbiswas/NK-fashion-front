---
description: Pre-merge quality checklist before committing changes
---

# Pre-Merge Checklist

Run through this checklist before committing or pushing any changes.

## Automated Checks

// turbo
1. **Run lint** — must pass with zero errors:
```bash
npm run lint
```

// turbo
2. **Run build** — must compile without errors:
```bash
npm run build
```

## Manual Checks

3. **No `any` types** — every variable, parameter, and return type must have an explicit type annotation. ESLint enforces this, but double-check edge cases.

4. **JSDoc on all methods** — every public and private method must have:
   - A description line
   - `@param` tags for each parameter
   - `@returns` tag describing the return value

5. **No relative imports** — all imports must use path aliases:
   - ✅ `import { X } from '@models/x.model';`
   - ✅ `import { X } from '@utils/input-validation/common.validator';`
   - ❌ `import { X } from '../../models/x.model';`
   - ❌ `import { X } from 'app/utils/...';`

6. **No unused imports/variables** — remove anything not referenced.

7. **No `console.log`** — only `console.error` is allowed (in error handlers only).

8. **No `*ngIf` / `*ngFor`** — only `@if` / `@for` control flow blocks allowed.

9. **No inline Tailwind classes in HTML** — all Tailwind classes must live in `.scss` files behind `@apply`.

10. **No explicit `interface I<Name>Labels`** — localization objects must use `as const`. No interface declarations for label objects.

11. **Route constants** — any new route path must be defined in `constants.ts` under the appropriate `*_CHILDREN` object, not hardcoded as strings in `app.routes.ts`.

12. **Japanese UI text** — all user-facing strings must be in Japanese via `jp-localization.ts`:
    - Error messages: `'取得に失敗しました'`, `'アクセスできません'`
    - Loading text: `'読み込み中...'`
    - Empty states: `'データがありません'`

13. **Loading & error states** — every API call must handle:
    - `loading = true` before the call (use `loadingCount` for concurrent calls — see RULES.md)
    - `loading = false` (or `loadingCount--`) in both `next` and `error`
    - `cd.detectChanges()` after async operations
    - Error display: popup for minor errors, card for 403/502

14. **Form validation** — before any form submit:
    - Check `form.invalid`
    - Call `form.markAllAsTouched()`
    - Show inline validation errors with `@if` blocks

15. **Orphaned files** — ensure no dead components exist that are not referenced in `app.routes.ts` and have no importers (search with `grep -r "ComponentName" src/`).

## Final Step

If all checks pass, the code is ready to commit. Run `/git-branch` workflow to commit and create a new branch.
