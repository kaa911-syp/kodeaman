# @aspidasec/i18n

Internationalization helpers and locale dictionaries for AspidaSec.

## Responsibility

- Provide English user-facing strings.
- Keep glossary terms consistent across reports, CLI output, bot comments, and lessons.

## Source of truth

- Locale files live in `src/locales/en.json`.
- Translation helpers live in `src/translator.ts`.
- Security glossary helpers live in `src/glossary.ts`.

## Verification

```bash
pnpm --filter @aspidasec/i18n typecheck
pnpm --filter @aspidasec/i18n build
```
