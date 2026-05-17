# @aspidasec/prioritizer

Risk prioritization for AspidaSec normalized findings.

## Responsibility

- Convert severity, confidence, reachability, and contextual signals into prioritization metadata.
- Explain prioritization reasons for developers and reports.
- Keep scoring deterministic and testable.

## Source of truth

- Prioritization logic lives in `src/prioritizer.ts`.
- Heuristic helpers live in `src/heuristics.ts`.

## Verification

```bash
pnpm --filter @aspidasec/prioritizer typecheck
pnpm --filter @aspidasec/prioritizer test
pnpm --filter @aspidasec/prioritizer build
```
