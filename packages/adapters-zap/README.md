# @aspidasec/adapters-zap

ZAP baseline adapter for AspidaSec web and DAST findings.

## Responsibility

- Execute or parse ZAP baseline output.
- Map ZAP alerts into `NormalizedFinding` objects.
- Preserve URL, HTTP, alert, CWE, confidence, and evidence metadata when available.

## Source of truth

- Adapter entrypoint lives in `src/adapter.ts`.
- Mapping logic lives in `src/mapper.ts`.
- Raw type definitions live in `src/types.ts`.
- Fixtures and tests live under `src/__tests__/`.

## Verification

```bash
pnpm --filter @aspidasec/adapters-zap typecheck
pnpm --filter @aspidasec/adapters-zap test
pnpm --filter @aspidasec/adapters-zap build
```
