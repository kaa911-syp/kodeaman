# @kodeaman/prioritizer

Risk prioritization for KodeAman normalized findings.

## Responsibility

- Convert severity, confidence, reachability, and contextual signals into prioritization metadata.
- Explain prioritization reasons for developers and reports.
- Keep scoring deterministic and testable.

## Source of truth

- Prioritization logic lives in `src/prioritizer.ts`.
- Heuristic helpers live in `src/heuristics.ts`.

## Verification

```bash
pnpm --filter @kodeaman/prioritizer typecheck
pnpm --filter @kodeaman/prioritizer test
pnpm --filter @kodeaman/prioritizer build
```
