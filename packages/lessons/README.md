# @kodeaman/lessons

Security micro-lessons for KodeAman developer coaching.

## Responsibility

- Store educational lesson metadata and Markdown lesson content.
- Connect findings to stable lesson IDs and slugs.
- Keep lessons practical, secure, and approachable for Indonesian developer teams.

## Source of truth

- Lesson registry and exports live in `src/index.ts`.
- Lesson types live in `src/types.ts`.
- Lesson Markdown content lives in `src/content/`.

## Verification

```bash
pnpm --filter @kodeaman/lessons typecheck
pnpm --filter @kodeaman/lessons build
```
