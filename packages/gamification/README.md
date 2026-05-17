# @aspidasec/gamification

Optional learning incentives for AspidaSec findings and lessons.

## Responsibility

- Track XP, badges, quests, and streak metadata.
- Encourage secure coding habits without minimizing vulnerability severity.
- Keep badge and quest keys stable once exposed.

## Source of truth

- Gamification engine lives in `src/engine.ts`.
- Badge definitions live in `src/badges.ts`.
- Quest definitions live in `src/quests.ts`.

## Verification

```bash
pnpm --filter @aspidasec/gamification typecheck
pnpm --filter @aspidasec/gamification test
pnpm --filter @aspidasec/gamification build
```
