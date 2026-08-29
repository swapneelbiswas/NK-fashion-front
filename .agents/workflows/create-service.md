---
description: How to create a new API service
---

# Create a New API Service

## Steps

// turbo
1. **Run the generator script**:
```bash
npm run g:service <domain-name>
```
Example: `npm run g:service session`

2. **Implement the service** at `src/app/services/<domain>/<domain>.service.ts`:

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { <Domain>ListResponse } from '@models/<domain>.model';

@Injectable({ providedIn: 'root' })
export class <Domain>Service {
  private readonly apiUrl: string = environment.api_url;

  /**
   * @param http - The Angular HttpClient
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches list of <items>.
   *
   * @param page - Current page number
   * @param limit - Items per page
   * @returns Observable of the list response
   */
  getList(page: number, limit: number): Observable<<Domain>ListResponse> {
    return this.http.get<<Domain>ListResponse>(
      `${this.apiUrl}/<endpoint>`,
      {
        withCredentials: true,
        params: { page, limit },
      },
    );
  }
}
```

Rules:
- Always `{ providedIn: 'root' }`
- Always `withCredentials: true`
- Always return `Observable<T>`
- JSDoc on all methods
- Use path alias `@env/environment` (not relative import)

3. **Create/update the model file** at `src/app/models/<domain>.model.ts`:

```typescript
export interface <Domain>ListResponse {
  status_code: 200;
  result: 'OK';
  total_count: number;
  <items>: Array<<Domain>ResponseItem>;
}

export interface <Domain>ResponseItem {
  <field>: string;
}

export interface Create<Domain>Request {
  <field>: string;
}
```

Model rules:
- One `.model.ts` file per domain
- Export only interfaces (no classes)
- Use `?` for optional fields
- Use string literal types for fixed values (`result: 'OK' | 'NG'`)
- Do NOT edit files in `src/app/models/` if they are auto-generated

4. **Add labels** in `src/app/utils/ln/jp-localization.ts` for any new UI text:
```typescript
export const MyDomainLabels = {
  TITLE: 'タイトル',
  SAVE: CommonLabels.SAVE,
} as const; // ← always "as const", no interface
```

5. **Wire up in the component**:
   - Inject via constructor: `private readonly myService: <Domain>Service`
   - Call in `ngOnInit()` or on user interaction
   - Follow the API call & error pattern from RULES.md

// turbo
6. **Run lint**:
```bash
npm run lint
```
