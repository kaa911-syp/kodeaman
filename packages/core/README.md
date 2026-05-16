# @kodeaman/core

Core scan pipeline orchestration for KodeAman.

## Responsibility

- Register and run scanner adapters.
- Deduplicate normalized findings.
- Sort and summarize findings for downstream output.
- Keep scanner-specific details outside the core package.

## Source of truth

- Pipeline logic lives in `src/pipeline.ts`.
- Deduplication logic lives in `src/dedup.ts`.

## Verification

```bash
pnpm --filter @kodeaman/core typecheck
pnpm --filter @kodeaman/core test
pnpm --filter @kodeaman/core build
```
