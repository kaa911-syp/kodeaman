# @aspidasec/output-markdown

Markdown report and review-comment rendering for AspidaSec.

## Responsibility

- Render normalized findings into Markdown for CLI and bot workflows.
- Preserve scanner evidence, severity, confidence, location, and coaching details.
- Keep generated explanations separate from scanner facts.

## Source of truth

- Main renderer lives in `src/renderer.ts`.
- CLI-focused rendering lives in `src/cli-renderer.ts`.

## Verification

```bash
pnpm --filter @aspidasec/output-markdown typecheck
pnpm --filter @aspidasec/output-markdown test
pnpm --filter @aspidasec/output-markdown build
```
