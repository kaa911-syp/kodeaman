# @aspidasec/adapters-npm-audit

npm audit adapter for AspidaSec dependency findings.

## Responsibility

- Parse `npm audit --json` output.
- Map dependency advisories into `NormalizedFinding` objects.
- Preserve package names, installed/fixed versions, advisory IDs, CVEs, CWE data, and severity.

## Source of truth

- Mapping logic lives in `src/mapper.ts`.
- Raw npm audit types live in `src/types.ts`.

## Verification

```bash
pnpm --filter @aspidasec/adapters-npm-audit typecheck
pnpm --filter @aspidasec/adapters-npm-audit build
```
