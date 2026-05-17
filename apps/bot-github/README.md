# @aspidasec/bot-github

GitHub pull request integration for AspidaSec.

## Responsibility

- Receive GitHub app events.
- Run configured AspidaSec scan modes for pull requests.
- Render and update deterministic PR comments.
- Avoid duplicate comments and avoid exposing secrets in public PR output.

## Source of truth

- Event handling lives in `src/handler.ts`.
- Comment rendering/updating support lives in `src/comment.ts`.
- Scanner and report behavior belongs in shared packages.

## Verification

```bash
pnpm --filter @aspidasec/bot-github typecheck
pnpm --filter @aspidasec/bot-github build
```
