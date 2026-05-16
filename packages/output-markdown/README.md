# @kodeaman/output-markdown

Markdown report and review-comment rendering for KodeAman.

## Responsibility

- Render normalized findings into Markdown for CLI and bot workflows.
- Preserve scanner evidence, severity, confidence, location, and coaching details.
- Keep generated explanations separate from scanner facts.

## Source of truth

- Main renderer lives in `src/renderer.ts`.
- CLI-focused rendering lives in `src/cli-renderer.ts`.

## Verification

```bash
pnpm --filter @kodeaman/output-markdown typecheck
pnpm --filter @kodeaman/output-markdown test
pnpm --filter @kodeaman/output-markdown build
```
