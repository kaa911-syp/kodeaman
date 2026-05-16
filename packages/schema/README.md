# @kodeaman/schema

Shared data contracts for KodeAman findings, evidence, OWASP reports, repository context, coaching, and gamification metadata.

## Responsibility

- Define scanner-neutral TypeScript types.
- Provide validation helpers for normalized data.
- Keep serialized report contracts stable for apps, bots, and output packages.

## Source of truth

- TypeScript type definitions live in `src/types.ts`.
- Zod validators live in `src/validators.ts`.
- Exported public API lives in `src/index.ts`.

## Boundaries

Do not put scanner-specific parser behavior here. Adapter packages own raw scanner parsing.

## Verification

```bash
pnpm --filter @kodeaman/schema typecheck
pnpm --filter @kodeaman/schema test
pnpm --filter @kodeaman/schema build
```
