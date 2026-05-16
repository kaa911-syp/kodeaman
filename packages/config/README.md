# @kodeaman/config

Configuration loading, defaults, and validation for KodeAman.

## Responsibility

- Load `.kodeaman.yml` when present.
- Merge repository configuration with safe defaults.
- Validate known configuration values before apps run scans.

## Source of truth

- Defaults live in `src/defaults.ts`.
- Loader and validation logic live in `src/loader.ts`.
- Public config types live in `src/types.ts`.

## Verification

```bash
pnpm --filter @kodeaman/config typecheck
pnpm --filter @kodeaman/config test
pnpm --filter @kodeaman/config build
```
