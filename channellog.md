# Channel Log

Recent changes made to the codebase, newest first.

---

## 2026-08-24

### `hospital-staff/invoice-confirmation-list` — 全確認 now confirms the whole dataset (export stays a separate step)
- `全確認` (select-all) previously only confirmed the currently-loaded page. It now confirms every record across the entire (date-filtered) dataset by simulating a real bulk operation: `InvoiceConfirmationService.confirmAll(confirmed, startDate, endDate)` pages through the simulated endpoint in fixed 100-record chunks (via `expand`, sequential, independent of the UI's own page size) until every matching page has been fetched and mutated, showing the loader throughout.
- Initially wired this to also auto-download the PDF once select-all finished — reverted per follow-up feedback: 全確認 only ever updates confirmed state now; `PDF 保存` remains the sole way to trigger an export, whether the selection came from 全確認 or manual per-row checks.
- Added `InvoiceConfirmationService.getConfirmedCountSnapshot()` — a synchronous read of the in-memory cached dataset (no simulated network delay) — and switched the component's `confirmedCount`/`hasConfirmedSelection` tracking to always read this instead of manually incrementing/decrementing, eliminating any chance of the count drifting out of sync with the bulk action.
- Verified the page-by-page confirm-all loop against the real 1000-record dataset with a standalone script: correctly walks all 10 chunks (100/chunk) and mutates every record via the shared cache.

### `hospital-staff/invoice-confirmation-list` — simulated real paginated API instead of loading the whole dataset
- New `InvoiceConfirmationService` (`src/app/services/invoice-confirmation/invoice-confirmation.service.ts`) simulates a real backend endpoint over the dummy dataset: `getInvoiceConfirmationList(page, limit, startDate, endDate, sortBy, sortDirection)` returns one page of records plus `{ page, limit, total_items, total_pages }` — the same shape and param naming (`start_date`/`end_date`) as this app's real endpoints (e.g. `DeliverService.getKoyamaDeliveryData`). The component now only ever holds one loaded page in memory, not the full 1000-record array.
- The service loads the dummy JSON once and caches it (`shareReplay`), reusing the same record object references across every page/filter call — this is what lets a `confirmed` checkbox toggle persist correctly when the user navigates to another page and back, without a separate client-side selection tracker.
- PDF export now calls a dedicated `getConfirmedRecords(startDate, endDate)` method — a realistic "confirmed=true" filter a real backend would support — instead of relying on a client-side full-dataset array that no longer exists. The export button's enabled state is tracked via a running `confirmedCount` updated on every toggle, avoiding an extra round trip just to check "is anything selected."
- Added a small simulated network delay (300ms) to `getInvoiceConfirmationList` so the loading state actually has something to show, matching real API latency.
- Verified the pagination math and date-range filtering logic against the real 1000-record dataset via a standalone Node script (not the live app): correct `total_items`/`total_pages` for both the full dataset and a narrowed date range, and correct page-slice contents.

## 2026-08-23

### `docs/` — linked workflow recipes and the new feature into `INDEX.md`
- Added a `## Workflows` section to `docs/INDEX.md` linking `.agents/workflows/*.md` (create-page, create-service, create-model, fix-lint, pre-merge, git-branch), so the index now covers *what the system does*, *for whom*, and *how to build on it* in one place.
- Added `docs/features/invoice-confirmation-list.md` and wired it into `INDEX.md`'s Features table, `docs/roles/hospital-staff.md`'s Pages table, and `INDEX.md`'s Known gaps section (dummy data, no backend `allowed_pages` entry yet).
- Fixed 4 stale `../README.md#known-gaps-as-of-this-writing` links (in `delivery-request.md`, `leader-management.md`, `hospital-staff.md`, `distribution-lists.md`) left over from the `docs/README.md` → `docs/INDEX.md` rename.

### `hospital-staff/invoice-confirmation-list` — real-text PDF export + 1000-record dummy dataset
- Replaced the html2canvas screenshot-based PDF export with a properly designed, real-text document: `jspdf-autotable` renders the table (title, styled header row, alternating row colors, page-number footer), swapping out `html2canvas` for `jspdf-autotable` as a dependency.
- jsPDF ships no Japanese glyphs at all, so added `src/app/utils/pdf/noto-sans-jp-subset.font.ts` — a Noto Sans JP TTF subset (~66KB, embedded as base64) covering the full hiragana/katakana syllabaries, ASCII, and every kanji used by this page's labels/dummy data, produced via `fonttools varLib.instancer` (pin to static Regular 400) + `pyftsubset`. `src/app/utils/pdf/register-japanese-font.ts` registers it on a `jsPDF` doc.
- **Bug fixed during this work**: the first subset attempt used `--name-IDs=''`, which stripped the font's required `name` table records (including ID 6, the PostScript name) — jsPDF's bundled TTF parser needs these and threw `Cannot read properties of undefined (reading '0')` while parsing the font, breaking PDF export entirely. Fixed by re-subsetting with `--name-IDs=1,2,3,4,6 --glyph-names` and dropping unneeded layout tables (`GSUB`/`GPOS`/`BASE`/`STAT`/`gasp`/`vhea`/`vmtx`/`DSIG`) instead of relying on subsetting defaults. Documented the constraint in the font file's header comment for any future re-subset.
- PDF export now covers the full filtered/sorted record set (not just the current page), since `jspdf-autotable` paginates and repeats the header row automatically. Generation is deferred one tick via `setTimeout` so the loader actually paints before the synchronous table-building work blocks the main thread.
- Replaced the 5-record hardcoded dummy array with a 1000-record generated dataset for realistic-scale testing, fetched at runtime via `HttpClient` from `public/assets/data/invoice-confirmation-list.json` (new `public/assets/data/` folder) instead of living in the component file.
- Added `InvoiceConfirmationListLabels.PDF_EXPORT_DATE_LABEL/PDF_PAGE_LABEL/PDF_CONFIRMED_STATUS/PDF_UNCONFIRMED_STATUS` for the PDF-only chrome (output-date line, page footer, 済/未 status) so no Japanese string is hardcoded outside `jp-localization.ts`.
- PDF export now includes only confirmed (checked) records from the current filtered set, not the whole filtered list — `exportToPdf()` filters `filteredSorted` by `.confirmed` before flattening into table rows, and the button disables via a new `hasConfirmedSelection` getter when nothing is checked.
- **Bug fixed**: the 1000-record dummy dataset had ~30% of records randomly pre-marked `confirmed: true` at generation time, so exporting after unchecking a few visible rows still pulled in hundreds of untouched-but-pre-confirmed records elsewhere in the dataset — looking indistinguishable from "exporting everything." Regenerated the dataset with every record starting unconfirmed, and defensively force `confirmed: false` on load in the component regardless of what the JSON contains, since confirmation is session-local review state, not persisted data.
- **Bug fixed**: table titles/headers rendered broken in the exported PDF. `jspdf-autotable`'s default header style requests the font's **bold** variant, but `register-japanese-font.ts` only registered our subset under `'normal'` — jsPDF silently falls back to Helvetica (no Japanese glyphs) whenever a style isn't registered, so every column header rendered blank/garbled while body text (registered, normal weight) was fine. Fixed by registering the same embedded font file under all four style keys (`normal`/`bold`/`italic`/`bolditalic`) so no request ever falls through to a non-Japanese font. Verified by generating a real PDF outside the browser (Node script + `jsPDF`/`jspdf-autotable`, rendered to PNG via `pdftoppm`) — title, header row, and body all render correctly now.

### `hospital-staff/invoice-confirmation-list` — new dummy 請求確認一覧 tab with PDF export
- New page `src/app/pages/hospital-staff/invoice-confirmation-list/` for the hospital-staff role: date-range filter, sortable columns (利用者ID/かな名/住所/電話番号/区分/部屋番号), 全確認 check-all toggle, per-row confirm checkbox, and a `PDF 保存` button — modeled on `CompletedDistributionList`'s flattened-row pattern and `UserList`'s orphaned `allConfirmed`/`toggleAllConfirmed` scaffold. Backed entirely by a hardcoded dummy dataset — there is no billing-confirmation API yet.
- Wired up: new `invoice-confirmation-list` route/page key (`constants.ts`, `app.routes.ts`), new sidebar entry between 利用者一覧 and 病院マスター (`sidebar.ts` + new `SidebarLabels.INVOICE_CONFIRMATION_LIST`). Reused the pre-existing, previously-unused `InvoiceConfirmationListLabels` block in `jp-localization.ts` — every column label was already written, just never wired to a component.
- PDF export uses `html2canvas` + `jsPDF` (both newly added deps) to rasterize the table and place it on one or more A4-landscape pages, since jsPDF's built-in fonts can't render Japanese text at all — embedding a real Japanese font would have added several MB to the bundle.
- **Known gap**: `allowed_pages` is returned by the backend login/whoami response with no local override, so this tab won't appear for a real hospital-staff login until backend adds the `invoice-confirmation-list` key to that role's allowed pages. Not verified in a live browser session for the same reason (no test credentials/backend available in this environment) — verified via a successful `ng build` and manual review against the target screenshot instead.

### `docs/README.md` → `docs/INDEX.md` — renamed to avoid clashing with project root README
- Renamed via `git mv` to preserve history; updated the one reference to it in this log.

---

## 2026-08-20

### `docs/` — added role-wise and feature-wise project documentation
- New `docs/INDEX.md` index describing the business domain, role table, feature table, and known gaps.
- New `docs/roles/{admin,leader,staff,hospital-staff}.md` — one page per role listing its routes and what it can/can't do.
- New `docs/features/*.md` (14 files) — one page per feature (auth/routing, branch, leader, ACL, hospital, room, classification, service/set catalog, option catalog, delivery-request, after-delivery, distribution lists, billing summary, user-list, shared components), covering fields, CRUD, validation, and business rules.
- Compiled from a full read of `src/app` (pages, services, models, routing, shared-components, utils) — captured several latent gaps found along the way: unrouted ACL page, unused job-polling in most CRUD flows, missing `'8'`/leader mapping in the incomplete-distribution-list filter, stubbed "sell" action, no CSV export despite older docs mentioning one, and an unwired hospital-staff distribution route constant.

---

## 2026-06-07 (5)

### `jp-localization.ts` + `user-list.html` — localize patient name search placeholder
- Added `PATIENT_NAME_PLACEHOLDER: CommonLabels.PATIENT_NAME` to `UserListLabels`.
- Replaced hardcoded `placeholder="利用者名"` with `[placeholder]="labels.PATIENT_NAME_PLACEHOLDER"` in the staff search input.

## 2026-06-07 (4)

### `jp-localization.ts` + `user-list.html` — localize date input placeholder
- Added `DATE_PLACEHOLDER: '日付を選択'` to `CommonLabels`.
- Referenced it as `DATE_PLACEHOLDER: CommonLabels.DATE_PLACEHOLDER` in `UserListLabels`.
- Replaced both hardcoded `placeholder="日付を選択"` in `user-list.html` with `[placeholder]="labels.DATE_PLACEHOLDER"`.

## 2026-06-07 (3)

### `user-list.ts` — use `formatPayloadDate` utility for date filter
- Replaced manual `YYYY-MM-DD` string construction in `onDateSelected` / `onEndDateSelected` with the shared `formatPayloadDate(date)` utility from `@utils/date-time-format`.

## 2026-06-07 (2)

### `user-list.ts` — date format fix
- `onDateSelected` and `onEndDateSelected` now store dates as `YYYY-MM-DD` (zero-padded, hyphen-separated) instead of `YYYY/M/D` so `displayDate()` can split on `-` correctly and render `2026年06月07日` instead of `2026/6/7年undefined月undefined日`.

---

## 2026-06-07

### `user-list.ts` — empty string lint fixes
- Replaced all `''` literals with `String()` at lines 155, 164, 721, 816 to satisfy `no-restricted-syntax` rule.

### `user-list.scss` — date filter alignment fix
- Changed `.fltr-left` alignment from `items-center` to `items-end` so date picker inputs align at the same baseline as the label-less dropdowns.

### `user-list.html` + `user-list.ts` + `user-list.scss` — role-based filter panel
- **Role 0 (admin) / Role 1 (leader):** filter row now shows status dropdown + start date picker + end date picker + branch name autocomplete + hospital name autocomplete + Search button.
- **Role 2 (staff):** filter row shows status dropdown + patient name search (unchanged behaviour).
- Added `isAdmin`, `isLeader` getters; `DropdownService` injected; branch/hospital load, search, select, clear, and infinite-scroll methods added.
- Added positioned calendar popup overlays (`suml-cal-backdrop` / `suml-cal-popup`) for start and end date filters.
- `loadDeliveryList` now passes date range and filter hospital/branch for admin/leader roles.
- Added date picker, calendar popup, and `btn-search` CSS classes to `user-list.scss`.

### `jp-localization.ts` — UserListLabels additions
- Added `SEARCH` (`'検索'`) and `LOADING` (`CommonLabels.LOADING`) keys to `UserListLabels`.

### `completed-distribution-list.ts` — lint fixes
- Added `: number` type annotation to `i` in `for` loop (line 129).
- Added `: DeliveryRequestListResponseDeliveryList | undefined` type to `primaryDl` (line 132).
- Added JSDoc comments to `toggleSort` and `getSortArrow` methods.
