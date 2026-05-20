# Architecture

AspidaSec should scale around clear product layers:

1. Scanner layer.
2. Analysis layer.
3. Guidance layer.
4. Output layer.

Each layer has a different responsibility. Keeping these boundaries clear prevents the codebase from becoming a collection of scanner-specific special cases.

## Layer Overview

```text
Input
  -> Scanner Layer
  -> Analysis Layer
  -> Guidance Layer
  -> Output Layer
  -> Developer / CI / PR
```

## Scanner Layer

The scanner layer collects evidence.

Responsibilities:

- Run scanner integrations.
- Capture raw scanner output.
- Preserve evidence, file paths, endpoints, packages, and reproduction context.
- Report scanner failures honestly.
- Avoid business logic beyond adapter-specific parsing.

Current and planned scanner sources:

- ZAP for dynamic website checks.
- Semgrep for static web application checks.
- npm, pnpm, or yarn audit for dependency checks.
- Playwright for route discovery and browser-context checks.
- Basic secret/config checks.
- Nuclei or additional scanners later, only after the golden path is strong.

Relevant packages:

- `packages/adapters-zap`
- `packages/adapters-semgrep`
- `packages/adapters-npm-audit`
- `packages/adapters-playwright`
- `packages/owasp`
- future scanner adapters

## Analysis Layer

The analysis layer turns scanner output into product decisions.

Responsibilities:

- Normalize scanner findings into one schema.
- Deduplicate equivalent findings.
- Map findings to OWASP categories.
- Normalize severity and confidence.
- Score risk using context.
- Decide which findings appear first.
- Preserve enough evidence for review.

Relevant packages:

- `packages/schema`
- `packages/core`
- `packages/config`
- `packages/prioritizer`
- `packages/owasp`

## Guidance Layer

The guidance layer helps developers act on validated findings.

Responsibilities:

- Summarize a finding in clear language.
- Explain impact.
- Provide practical remediation steps.
- Provide safe examples where available.
- Translate or localize guidance into Bahasa Indonesia and English.
- Reference scanner evidence or trusted external material.

The guidance layer must not create findings. It only explains findings produced by the scanner and analysis layers.

Relevant packages:

- `packages/coaching`
- `packages/i18n`
- `packages/lessons`
- `packages/mcp-server` for assistant-facing guidance tools

## Output Layer

The output layer makes the result usable.

Responsibilities:

- Render CLI summaries.
- Render HTML reports.
- Render Markdown reports and PR comments.
- Render JSON for automation.
- Render SARIF for code scanning tools.
- Keep reports readable, prioritized, and evidence-backed.

Relevant packages:

- `packages/output-markdown`
- `packages/output-html`
- `packages/output-sarif`
- `apps/cli`
- `apps/bot-github`
- `apps/bot-gitlab`
- `apps/bot-gitea`
- `packages/mcp-server`

## Boundary Rules

- Scanner adapters should not decide product-level priority.
- Prioritization should not fabricate scanner evidence.
- Guidance should not invent findings.
- Output renderers should not change finding meaning.
- CI integrations should preserve the same report semantics as local CLI output.

## Preferred Data Flow

1. Input target is resolved.
2. Configuration is loaded.
3. Scanner adapters run.
4. Raw scanner results are parsed.
5. Findings are normalized.
6. Findings are deduplicated.
7. Findings are mapped to OWASP where possible.
8. Findings are prioritized.
9. Guidance is attached.
10. Output renderers generate the chosen report format.

## Architecture Smell List

Stop and refactor when:

- A scanner adapter knows about HTML report layout.
- An output renderer recalculates severity.
- AI text writes new finding IDs.
- Config parsing happens inside scanner-specific code.
- PR bot behavior diverges from CLI behavior.
- Dashboard needs drive scan pipeline design before the CLI workflow is strong.
