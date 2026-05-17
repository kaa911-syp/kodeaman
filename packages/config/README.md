# @aspidasec/config

Configuration loading, defaults, and validation for AspidaSec.

## Responsibility

- Load `.aspidasec.yml` when present.
- Merge repository configuration with safe defaults.
- Validate known configuration values before apps run scans.

## Source of truth

- Defaults live in `src/defaults.ts`.
- Loader and validation logic live in `src/loader.ts`.
- Public config types live in `src/types.ts`.

## Verification

```bash
pnpm --filter @aspidasec/config typecheck
pnpm --filter @aspidasec/config test
pnpm --filter @aspidasec/config build
```
