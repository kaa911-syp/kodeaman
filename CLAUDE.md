# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install
pnpm install

# Build all packages (respects Turborepo dependency order)
pnpm run build

# Run tests
pnpm run test

# Run tests for a single package
pnpm --filter @aspidasec/core run test
pnpm --filter @aspidasec/core run test:watch

# Type check
pnpm run typecheck

# Lint
pnpm run lint

# Format (writes)
pnpm run format

# Run CLI directly (build first)
pnpm --filter @aspidasec/cli start -- scan ./my-project
pnpm --filter @aspidasec/cli start -- owasp-scan --format html --output report.html

# Docker (for self-hosted bot)
docker compose up -d
```

`turbo run build` handles inter-package build ordering — always `pnpm run build` from root before running the CLI or dependent tests.

## Architecture

Four product layers, each with strict package boundaries:

| Layer | Packages | Rule |
|-------|----------|------|
| Scanner | `adapters-*`, `owasp` | Collect raw evidence only. No prioritization or guidance logic. |
| Analysis | `schema`, `core`, `prioritizer`, `config` | Normalize, deduplicate, score. No output rendering. |
| Guidance | `coaching`, `i18n` | Remediation templates + bilingual text. No scanner calls. |
| Output | `output-markdown`, `output-html`, `output-sarif`, `mcp-server` | Render. No business logic. |

Entry point: `apps/cli` — wires all layers via `commander` commands in `src/commands/`.

### Core scan pipeline (`packages/core`)

`ScanPipeline` in `pipeline.ts`:
1. Runs each registered `ScannerAdapter` sequentially
2. Deduplicates findings (`dedup.ts`)
3. Scores and sorts via `Prioritizer` (`packages/prioritizer`)
4. Builds summary and `CoverageReport`
5. Runs plugin `afterScan` hooks

Plugin system: `AspidasecPlugin` with `beforeScan`/`afterScan`/`onAdapterRegistered` hooks. Adapters can be registered directly or bundled inside a plugin.

### NormalizedFinding (`packages/schema`)

Central data contract. Every scanner adapter must produce `NormalizedFinding[]`. Key sub-fields:
- `prioritization: PrioritizationFactors` — scored by the prioritizer, never by adapters
- `coaching: CoachingContent` — bilingual EN/ID titles, summaries, remediation steps
- `gamification: GamificationMeta` — XP, badges (present in schema, not MVP-critical)
- `evidence: EvidenceBlock[]` — required for trust model compliance; never fabricate
- `raw: RawToolRefs` — original tool output reference (source of truth for evidence)

### Scanner adapters (`packages/adapters-*`)

Each adapter: `adapter.ts` (exec tool, parse stdout), `mapper.ts` (raw → `NormalizedFinding`), `types.ts` (raw tool types). Adapters are skipped cleanly when the external tool is unavailable — they must not generate findings without real scanner output.

Available adapters: `semgrep`, `npm-audit`, `zap` (baseline + full), `bandit`, `gosec`, `cargo-audit`, `spotbugs`, `playwright`.

### OWASP orchestration (`packages/owasp`)

`orchestrator.ts` runs per-category scans, applies confidence and evidence gates, maps findings to OWASP Top 10, and returns `OwaspScanReport`. Environment detection in `environment.ts` handles WSL vs native. False-positive filter in `false-positive-filter.ts`.

### Config (`.aspidasec.yml`)

Loaded by `packages/config`. Schema defines `AspidasecConfig` in `packages/core/src/types.ts`. Config controls which scanners run, output formats, OWASP options, and `language` (`en` | `id`).

## Trust Model

**Do not fabricate findings.** Every `NormalizedFinding` must trace to real scanner output, repo analysis, dependency audit data, or explicit user-provided evidence. If a scanner fails or is skipped, report that in `CoverageReport` — do not replace missing output with generated findings. AI/generated text is allowed only in `coaching` content (summaries, fix guidance), not in `evidence`, `location`, or `prioritization` fields.

## Key Constraints

- All packages use ESM (`"type": "module"`) with `NodeNext` module resolution.
- TypeScript strict mode; `tsconfig.base.json` is the shared base — each package extends it.
- Biome handles both linting and formatting (2-space indent, double quotes, trailing commas, 100-char line width).
- Turborepo caches `dist/**` and `coverage/**`; `build` must complete before `test` or `typecheck` in dependent packages.
- `packages/schema` is the only source of `NormalizedFinding` — never redefine it in adapters or output packages.
- `packages/i18n` owns all Bahasa Indonesia translations; `CoachingContent` in findings carries both `*En` and `*Id` fields.
