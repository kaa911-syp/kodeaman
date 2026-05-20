# Roadmap

This roadmap tracks product milestones for AspidaSec.

AspidaSec is now scoped as a CLI-first website security scanner that helps developers identify, prioritize, and fix OWASP-related security risks in modern web applications.

The current product filter is:

- Scanning
- Prioritization
- Remediation
- Reporting
- CI or PR workflow

Features that do not support one of those areas should not enter the MVP.

See:

- [Product Scope](./docs/product-scope.md)
- [MVP](./docs/mvp.md)
- [Architecture](./docs/architecture.md)
- [Product Philosophy](./docs/product-philosophy.md)
- [Trust Model](./docs/trust-model.md)
- [Golden Path](./docs/golden-path.md)

---

## Current Phase -- Product Foundation

- [x] Define AspidaSec as a developer-first website security scanner
- [x] Remove training/ecosystem positioning from primary README messaging
- [x] Document MVP scope and non-MVP boundaries
- [x] Document scanner, analysis, guidance, and output architecture
- [x] Document the trust model: AI must never invent findings
- [x] Document the CLI-first golden path
- [ ] Refactor package boundaries where implementation violates the documented architecture
- [ ] Tune CLI and report UX around "Top 5 Risks", "Fix First", evidence, and remediation clarity
- [ ] De-emphasize dashboard and gamification in user-facing website copy until the golden path is strong

## MVP Freeze

The MVP is limited to:

- OWASP-oriented website security scanning
- ZAP dynamic scanning
- dependency audit
- Semgrep web checks
- basic secret/config review
- Playwright route discovery where useful
- finding normalization and deduplication
- risk prioritization
- Bahasa Indonesia and English remediation guidance
- HTML, Markdown, JSON, SARIF, CI, and PR output

Deferred until after MVP:

- hosted dashboard
- multi-tenant backend
- auth/RBAC
- enterprise policy management
- advanced analytics
- leaderboard or gamification-first workflows
- attack simulation labs
- custom IDEs
- cloud sync
- multi-agent research workflows

## Sprint 0 -- Repository Foundation

- [x] Initialize monorepo with pnpm workspaces, Turborepo, and TypeScript strict mode
- [x] Add Apache 2.0 license and governance files
- [x] Create `@aspidasec/schema` with `NormalizedFinding` types and validators
- [x] Set up CI workflow with GitHub Actions
- [x] Create issue templates and labels
- [x] Add README, ROADMAP, CONTRIBUTING, and AGENTS.md

## Sprint 1 -- Core Scan Pipeline

- [x] Build CLI skeleton with `aspidasec scan` command
- [x] Implement Semgrep SAST adapter and parser
- [x] Add markdown output package for PR comments and console reports
- [x] Build prioritizer v0 with severity and confidence scoring
- [x] Write 10 bilingual coaching templates (Bahasa Indonesia + English)
- [x] Add `examples/demo-node-express` demo project

## Sprint 2 -- GitHub PR Bot

- [x] Scaffold GitHub bot app with Probot
- [x] Connect bot to core scan pipeline
- [x] Implement PR comment formatting with top 3 prioritized findings
- [x] Add badges and XP notes to PR comments
- [x] Add `.aspidasec.yml` configuration file support
- [ ] Pilot dry run on 2 demo repositories
- [ ] Improve false positive presentation and noise reduction

## Sprint 3 -- GitLab, Lessons, and Self-Hosting

- [x] Scaffold GitLab webhook service with Hono
- [x] Reuse core pipeline in GitLab bot
- [x] Add Docker Compose deployment configuration
- [x] Build micro-lesson registry with lesson linking
- [x] Create Laravel preset v0
- [ ] Add validation telemetry file output
- [ ] Pilot with 3-4 external repositories

## Sprint 4 -- OWASP Top 10 and npm Audit

- [x] Add ZAP DAST baseline adapter
- [x] Build OWASP Top 10 scan mode with per-category orchestration
- [x] Add HTML evidence report output with OWASP dashboard
- [x] Implement npm audit adapter for SCA (OWASP A06)
- [x] Document OWASP evidence policy and scanner coverage expectations
- [x] Write onboarding documentation for GitHub, GitLab, CLI, and self-hosting
- [x] Improve prioritizer with context flags (direct vs transitive dependency, fix availability)
- [ ] Add 10 more bilingual coaching templates
- [ ] Run 15 developer interviews and collect pilot feedback

## Sprint 5 -- MCP Server and Vibe Coding

- [x] Build `@aspidasec/mcp-server` with 8 MCP tools
- [x] Fix npm-audit adapter interface mismatch (`repoRoot` vs `targetPath`)
- [x] Enable config-less scanning with auto-detection of npm projects
- [x] Validate adapter resilience when scanning projects without `.aspidasec.yml`
- [x] Add MCP server documentation to docs site
- [ ] Publish MCP server to npm registry
- [ ] Test MCP integration with Cursor, Windsurf, and other AI coding assistants

## Sprint 6 -- Plugin System, IDE Integration, and Gitea Support

- [x] Build plugin system in `@aspidasec/core` with lifecycle hooks (`beforeScan`, `afterScan`, `onFinding`, `onError`)
- [x] Add `PluginLoader` for dynamic plugin discovery and validation
- [x] Build `@aspidasec/bot-gitea` with HMAC-SHA256 webhook verification and Forgejo compatibility
- [x] Build `@aspidasec/vscode-extension` with inline diagnostics and scan command
- [x] Add SARIF output documentation for VS Code and JetBrains integration
- [x] Add `@aspidasec/telemetry` with JSONL file writer for scan validation output
- [x] Add `@aspidasec/test-utils` with shared mock finding factories
- [x] Add npm registry metadata to all packages for publishing readiness
- [ ] Publish all packages to npm registry
- [ ] Submit VS Code extension to Visual Studio Marketplace
- [ ] End-to-end test Gitea bot with Forgejo instance
- [ ] Add 10 more bilingual coaching templates

## Sprint 7 -- Bug Fixes, Multi-Language Adapters, and Pipeline Hardening

- [x] Fix priority scores always 0 by integrating `Prioritizer` into `ScanPipeline.run()`
- [x] Fix OWASP orchestrator duplicating findings across categories (run pipeline once, distribute findings)
- [x] Fix npm-audit PostCSS remediation text confusing vulnerable package with fix package
- [x] Fix coverage report showing 10% instead of 100% during OWASP scans
- [x] Add `@aspidasec/adapters-bandit` for Python SAST via Bandit
- [x] Add `@aspidasec/adapters-gosec` for Go SAST via gosec
- [x] Add `@aspidasec/adapters-cargo-audit` for Rust SCA via cargo-audit
- [x] Add `@aspidasec/adapters-spotbugs` for Java SAST via SpotBugs
- [x] Add `repoContext` to `ScanContext` for prioritizer heuristics
- [x] Add `scannedCategories` to `OwaspScanReport` for accurate coverage tracking
- [x] Add `@aspidasec/watcher` with `aspidasec watch` CLI command for real-time file monitoring
- [x] Add `@aspidasec/autofix` with `aspidasec autofix` CLI command for automated fix execution
- [x] Add `@aspidasec/custom-rules` with `aspidasec rules` CLI command for user-defined security rules
- [x] Add `@aspidasec/dashboard` with `aspidasec dashboard` CLI command for web-based trend tracking
- [x] Add `@aspidasec/history` with `aspidasec history` CLI command for scan history and team collaboration
- [ ] Add 10 more bilingual coaching templates

## Repository Organization

- [x] Source code lives in `apps/*/src` and `packages/*/src`
- [x] Root operational files: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `biome.json`, `tsconfig.base.json`, `docker-compose.yml`
- [x] GitHub configuration under `.github/` (issue templates, workflows, CODEOWNERS)
- [x] README files beside all app and package folders
- [x] Onboarding guides under `docs/`
- [x] Demo projects under `examples/`
- [x] Example `.aspidasec.yml` configurations under `examples/configs/`

---

## Future

- Advanced autofix with AST-based patch generation
- Team leaderboard and challenge quests
- Multi-project aggregated analytics dashboard
- Multi-language support beyond Bahasa Indonesia and English
- Enterprise policy engine with role-based access control
- CI/CD integration with GitHub Actions and GitLab CI templates
- Webhook notifications for scan results (Slack, Discord, Teams)
