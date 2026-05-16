# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-05-16

### Added

- `ROADMAP.md` repository organization backlog — Updated roadmap status with implemented OWASP/npm-audit/HTML milestones, package/app documentation progress, and follow-up folders for `docs/`, `examples/`, and `.kodeaman.yml` examples
- Package and app README files — Added local responsibility, source-of-truth, and verification notes beside each important `apps/*` and `packages/*` workspace folder
- `AGENTS.md` next-step prompt template — Task-specific prompt pattern that anchors agents to the repository operating rules, scoped workflow requirements, examples for common change types, and the required Completion Summary format
- **OWASP Top 10 Scan Mode** — Structured security scanning organized by OWASP Top 10 (2021) categories A01 through A10
- `@kodeaman/owasp` — OWASP scan orchestrator with per-category scanning, confidence gates, evidence gates, multi-scanner (SAST+DAST) correlation, environment detection (WSL/Linux/macOS/Windows), bilingual progress reporting, and WSL installation guidance
- `@kodeaman/adapters-npm-audit` — npm audit adapter that parses `npm audit --json` output into NormalizedFinding format, mapping vulnerabilities to OWASP A06 (Vulnerable and Outdated Components) with bilingual coaching
- `@kodeaman/output-html` — Self-contained HTML evidence report generator with OWASP coverage dashboard, per-category severity breakdowns, evidence cards with code snippets, gamification section, and light/dark/auto theme support
- `kodeaman owasp-scan` CLI command with options: `--format` (html/markdown/json), `--language` (en/id), `--categories` (comma-separated A01-A10), `--confidence` (low/medium/high gate), `--no-evidence-gate`, `--parallel`, `--skip-wsl-check`, `--output`, `--preset`, `--verbose`
- OWASP mode in GitHub bot (Probot) and GitLab bot (Hono) — activated via `owasp.enabled: true` in `.kodeaman.yml`, generates OWASP-structured PR/MR comments and optional HTML reports
- `owasp` configuration section in `.kodeaman.yml` with `enabled`, `categories`, `parallel`, `confidenceGate`, `evidenceGate`, and `failOnSeverity` options
- `environment` configuration section in `.kodeaman.yml` with `skipWslCheck` and `scannerTimeout` options
- `npmAudit` scanner toggle in `.kodeaman.yml` scanners section
- `html` output toggle in `.kodeaman.yml` output section
- `owaspCategory` optional field on `ScanContext` in `@kodeaman/core` for per-category pipeline runs
- `OwaspScanPhaseResult` and `OwaspScanReport` types in `@kodeaman/schema`

### Changed

- CLI version bumped to 0.2.0
- `@kodeaman/config` types extended with `OwaspScanConfig` and `EnvironmentConfig` interfaces
- Config defaults now include OWASP and environment sections
- Config validation extended to cover `owasp.confidenceGate` and `owasp.failOnSeverity`
- GitHub and GitLab bot handlers now check `config.owasp.enabled` to choose between standard and OWASP scan modes

## [0.1.0] - 2026-05-15

### Added

- Initial monorepo setup with pnpm workspaces and turborepo
- `@kodeaman/schema` — Canonical NormalizedFinding TypeScript interfaces and Zod validators
- `@kodeaman/core` — Scan pipeline orchestrator with adapter registration, deduplication, and summary
- `@kodeaman/adapters-semgrep` — Semgrep JSON output parser and normalizer
- `@kodeaman/adapters-zap` — ZAP baseline JSON report parser and normalizer
- `@kodeaman/prioritizer` — Priority scoring engine with severity, confidence, and context-aware heuristics
- `@kodeaman/coaching` — 20 bilingual coaching templates (English + Bahasa Indonesia)
- `@kodeaman/i18n` — Translator with en/id locale files and security glossary
- `@kodeaman/lessons` — 10 bilingual micro-lessons for common security issues
- `@kodeaman/gamification` — XP, badges, quests, and streak tracking
- `@kodeaman/presets` — Laravel, Node/Express, and WordPress framework presets
- `@kodeaman/config` — `.kodeaman.yml` config loader with defaults and validation
- `@kodeaman/output-markdown` — PR comment renderer and CLI console renderer
- `@kodeaman/cli` — CLI tool with `kodeaman scan` and `kodeaman init` commands
- `@kodeaman/bot-github` — GitHub PR reviewer bot (Probot)
- `@kodeaman/bot-gitlab` — GitLab MR reviewer bot (Hono)
- Docker Compose deployment setup
- Apache License 2.0
