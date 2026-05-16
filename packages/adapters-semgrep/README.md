# @kodeaman/adapters-semgrep

Semgrep adapter for KodeAman.

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
pnpm --filter @kodeaman/adapters-semgrep typecheck
pnpm --filter @kodeaman/adapters-semgrep test
pnpm --filter @kodeaman/adapters-semgrep build
```
