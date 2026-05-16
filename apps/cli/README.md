# @kodeaman/cli

Command-line interface for local KodeAman workflows.

## Responsibility

- Parse `kodeaman scan`, `kodeaman init`, and `kodeaman owasp-scan` commands.
- Load repository configuration through `@kodeaman/config`.
- Compose core, adapter, OWASP, and output packages into local developer workflows.
- Keep CLI output script-friendly and safe for CI.

## Source of truth

- Command implementations live in `src/commands/`.
- Logging helpers live in `src/utils/`.
- Scanner normalization belongs in adapter packages, not this app.

## Verification

```bash
pnpm --filter @kodeaman/cli typecheck
pnpm --filter @kodeaman/cli build
```
