# @aspidasec/adapters-semgrep

Semgrep adapter for AspidaSec.

## Responsibility

- Execute or parse Semgrep results.
- Map Semgrep findings into `NormalizedFinding` objects.
- Preserve Semgrep rule IDs, locations, evidence, severity, confidence, and CWE/OWASP metadata when available.

## Source of truth

- Adapter entrypoint lives in `src/adapter.ts`.
- Mapping logic lives in `src/mapper.ts`.
- Raw type definitions live in `src/types.ts`.
- Fixtures and tests live under `src/__tests__/`.

## Verification

```bash
pnpm --filter @aspidasec/adapters-semgrep typecheck
pnpm --filter @aspidasec/adapters-semgrep test
pnpm --filter @aspidasec/adapters-semgrep build
```
