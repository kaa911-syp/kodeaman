# @aspidasec/lessons

Security micro-lessons for AspidaSec developer coaching.

## Responsibility

- Store educational lesson metadata and Markdown lesson content.
- Connect findings to stable lesson IDs and slugs.
- Keep lessons practical, secure, and approachable.

## Source of truth

- Lesson registry and exports live in `src/index.ts`.
- Lesson types live in `src/types.ts`.
- Lesson Markdown content lives in `src/content/`.

## Verification

```bash
pnpm --filter @aspidasec/lessons typecheck
pnpm --filter @aspidasec/lessons build
```
