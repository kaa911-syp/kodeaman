# @kodeaman/output-html

Self-contained HTML report generation for KodeAman.

## Responsibility

- Render OWASP dashboards, evidence cards, severity summaries, and optional gamification.
- Escape scanner-controlled content before writing HTML.
- Preserve evidence policy and scanner-derived finding details for stakeholder review.

## Source of truth

- Report generator lives in `src/html-report.ts`.
- Templates live in `src/templates.ts`.
- Styling lives in `src/styles.ts`.
- Report config types live in `src/types.ts`.

## Verification

```bash
pnpm --filter @kodeaman/output-html typecheck
pnpm --filter @kodeaman/output-html test
pnpm --filter @kodeaman/output-html build
```
