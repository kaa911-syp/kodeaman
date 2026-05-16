# @kodeaman/bot-gitlab

GitLab merge request integration for KodeAman.

## Responsibility

- Receive GitLab webhook events.
- Run configured KodeAman scan modes for merge requests.
- Render and update MR comments with actionable security coaching.
- Keep scanner output safe for review contexts.

## Source of truth

- Event handling lives in `src/handler.ts`.
- Comment rendering/updating support lives in `src/comment.ts`.
- Scanner normalization and report formatting belong in shared packages.

## Verification

```bash
pnpm --filter @kodeaman/bot-gitlab typecheck
pnpm --filter @kodeaman/bot-gitlab build
```
