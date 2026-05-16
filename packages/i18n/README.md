# @kodeaman/i18n

Internationalization helpers and locale dictionaries for KodeAman.

## Responsibility

- Provide English and Bahasa Indonesia user-facing strings.
- Keep glossary terms consistent across reports, CLI output, bot comments, and lessons.
- Ensure translated keys stay synchronized.

## Source of truth

- Locale files live in `src/locales/en.json` and `src/locales/id.json`.
- Translation helpers live in `src/translator.ts`.
- Security glossary helpers live in `src/glossary.ts`.

## Verification

```bash
pnpm --filter @kodeaman/i18n typecheck
pnpm --filter @kodeaman/i18n build
```
