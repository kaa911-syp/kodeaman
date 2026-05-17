# @aspidasec/coaching

Developer-facing remediation guidance for AspidaSec findings.

## Responsibility

- Generate or select educational coaching content for normalized findings.
- Keep remediation guidance practical, secure, and bilingual when user-facing.
- Avoid presenting generated explanations as scanner evidence.

## Source of truth

- Coaching generation logic lives in `src/generator.ts`.

## Verification

```bash
pnpm --filter @aspidasec/coaching typecheck
pnpm --filter @aspidasec/coaching build
```
