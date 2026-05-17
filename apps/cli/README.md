# @aspidasec/cli

Command-line interface for local AspidaSec workflows.

## Responsibility

- Parse `aspidasec scan`, `aspidasec init`, and `aspidasec owasp-scan` commands.
- Load repository configuration through `@aspidasec/config`.
- Compose core, adapter, OWASP, and output packages into local developer workflows.
- Keep CLI output script-friendly and safe for CI.

## Source of truth

- Command implementations live in `src/commands/`.
- Logging helpers live in `src/utils/`.
- Scanner normalization belongs in adapter packages, not this app.

## Verification

```bash
pnpm --filter @aspidasec/cli typecheck
pnpm --filter @aspidasec/cli build
```
