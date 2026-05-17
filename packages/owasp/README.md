# @aspidasec/owasp

OWASP Top 10 scan orchestration for AspidaSec.

## Responsibility

- Coordinate category-level OWASP Top 10 scanning from A01 through A10.
- Apply confidence and evidence gates to scanner-derived findings.
- Report environment and scanner availability metadata.
- Keep detection evidence scanner-derived; do not create findings from generated text.

## Source of truth

- Category metadata lives in `src/categories.ts`.
- Orchestration lives in `src/orchestrator.ts`.
- Environment and WSL detection live in `src/environment.ts`.
- Progress messages live in `src/progress.ts`.

## Verification

```bash
pnpm --filter @aspidasec/owasp typecheck
pnpm --filter @aspidasec/owasp test
pnpm --filter @aspidasec/owasp build
```
