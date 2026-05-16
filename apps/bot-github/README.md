# @kodeaman/bot-github

GitHub pull request integration for KodeAman.

## Responsibility

- Receive GitHub app events.
- Run configured KodeAman scan modes for pull requests.
- Render and update deterministic PR comments.
- Avoid duplicate comments and avoid exposing secrets in public PR output.

## Source of truth

- Event handling lives in `src/handler.ts`.
- Comment rendering/updating support lives in `src/comment.ts`.
- Scanner and report behavior belongs in shared packages.

## Verification

```bash
pnpm --filter @kodeaman/bot-github typecheck
pnpm --filter @kodeaman/bot-github build
```
