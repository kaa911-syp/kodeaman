# @kodeaman/presets

Framework-specific scanning presets for KodeAman.

## Responsibility

- Define preset metadata for common stacks such as Laravel, Node/Express, and WordPress.
- Help apps choose relevant scanner settings and categories without hardcoding framework logic in the CLI.
- Keep preset behavior documented and testable.

## Source of truth

- Preset loader lives in `src/loader.ts`.
- Preset type definitions live in `src/types.ts`.
- Framework presets live in `src/presets/`.

## Verification

```bash
pnpm --filter @kodeaman/presets typecheck
pnpm --filter @kodeaman/presets test
pnpm --filter @kodeaman/presets build
```
