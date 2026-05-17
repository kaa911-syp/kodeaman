# @aspidasec/presets

Framework-specific scanning presets for AspidaSec.

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
pnpm --filter @aspidasec/presets typecheck
pnpm --filter @aspidasec/presets test
pnpm --filter @aspidasec/presets build
```
