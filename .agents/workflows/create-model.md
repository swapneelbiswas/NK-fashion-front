---
description: How to create or update model interfaces from the API spec
---

# Create or Update Model Interfaces

## Steps

1. **Check the OpenAPI spec** (`rest_api.yml`) for the endpoint schema:
   - Find the endpoint path
   - Look at the response schema under `responses.200.content.application/json.schema`
   - Look at the request body schema if applicable

2. **Create/update the model file** at `src/app/models/<domain>.model.ts`:

Rules:
- One `.model.ts` file per domain
- Export only **interfaces** (no classes, no enums)
- Use explicit types: `string`, `number`, `boolean`, `Array<T>`
- Mark optional fields with `?`
- Use string literal types for fixed values: `result: 'OK' | 'NG'`
- Use `status_code: 200` for success responses

Naming conventions:
| Pattern | Example |
|---------|---------|
| List response | `SessionListResponse` |
| Item in list | `SessionListResponseItem` |
| Detail response | `SessionDetailResponse` |
| Create request | `CreateSessionRequest` |
| Update request | `UpdateSessionRequest` |

3. **Example model file**:

```typescript
/**
 * Response for GET /sessions
 */
export interface SessionListResponse {
  status_code: 200;
  result: 'OK';
  total_count: number;
  sessions: Array<SessionListResponseItem>;
}

/**
 * Individual session item in list response.
 */
export interface SessionListResponseItem {
  session_id: string;
  user_id: string;
  branch_id: string;
  is_active: string;
  ip_address?: string;
  created_at?: string;
}
```

4. **Auto-generate models from OpenAPI** (alternative):
```bash
npm run generate:models
```
This runs `openapi-generator-cli` against `rest_api.yml` and then processes the output with `generate_models.ts`.

> **Note**: Auto-generated models may need manual cleanup to match project conventions (interface naming, optional fields).
