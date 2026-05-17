# @aspidasec/core

Core scan pipeline orchestration for AspidaSec.

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
pnpm --filter @aspidasec/core typecheck
pnpm --filter @aspidasec/core test
pnpm --filter @aspidasec/core build
```
