# @aspidasec/output-html

Self-contained HTML report generation for AspidaSec.

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
pnpm --filter @aspidasec/output-html typecheck
pnpm --filter @aspidasec/output-html test
pnpm --filter @aspidasec/output-html build
```
