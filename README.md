# KodeAman

**Open-core security coach agent for Indonesian developers.**

> "Kode Aman" (Bahasa Indonesia) = "Secure Code"

---

## Overview

Most SAST/DAST tools produce hundreds of findings, provide only English guidance, and assume senior-level security expertise. Indonesian development teams -- startups, campus labs, government digitization projects -- end up ignoring noise or copy-pasting fixes they do not understand. Vulnerabilities stay open and learning never happens.

KodeAman changes that. It is a security coach agent that scans your code, prioritizes findings by real-world risk, and teaches developers how to fix issues -- in Bahasa Indonesia or English -- with contextual explanations, fix suggestions, and micro-lessons.

### Key Capabilities

- **Scan** code with pluggable adapters: Semgrep (SAST), ZAP (DAST), npm audit (SCA), Playwright (browser).
- **Prioritize** findings by real-world risk using CVSS context and reachability heuristics.
- **Coach** developers in Bahasa Indonesia or English with per-finding explanations and remediation steps.
- **Gamify** secure coding habits with XP, streaks, badges, and leaderboards.
- **Integrate** into your workflow: MCP server (Vibe Coding), GitHub bot, GitLab bot, CLI, or CI pipeline.

### Who It Is For

- Indonesian startups shipping fast and concerned about OWASP Top 10.
- University CS programs teaching secure development.
- Government digital-service teams meeting compliance requirements.
- Any team that wants actionable, educational security feedback -- not a wall of CVEs.

---

## Architecture

KodeAman is a TypeScript monorepo using pnpm workspaces and Turborepo. It contains 19 packages and 4 apps organized as follows:

### Core Packages

| Package | Description |
|---------|-------------|
| `@kodeaman/schema` | Canonical `NormalizedFinding` types and Zod validators |
| `@kodeaman/core` | Scan pipeline orchestrator with adapter registration and deduplication |
| `@kodeaman/config` | `.kodeaman.yml` config loader with defaults and validation |
| `@kodeaman/prioritizer` | Priority scoring engine with severity, confidence, and context heuristics |

### Scanner Adapters

| Package | Description |
|---------|-------------|
| `@kodeaman/adapters-semgrep` | Semgrep SAST JSON output parser and normalizer |
| `@kodeaman/adapters-zap` | ZAP DAST baseline report parser and normalizer |
| `@kodeaman/adapters-npm-audit` | npm/pnpm audit SCA adapter (OWASP A06) with bilingual coaching |
| `@kodeaman/adapters-playwright` | Playwright browser-based scanner adapter |

### Education and Gamification

| Package | Description |
|---------|-------------|
| `@kodeaman/coaching` | 20 bilingual coaching templates for common vulnerabilities |
| `@kodeaman/lessons` | 10 bilingual micro-lessons for OWASP Top 10 categories |
| `@kodeaman/i18n` | Translator with en/id locale files and security glossary |
| `@kodeaman/gamification` | XP, badges, quests, and streak tracking |
| `@kodeaman/presets` | Framework presets: Laravel, Node/Express, WordPress |

### Output and Reporting

| Package | Description |
|---------|-------------|
| `@kodeaman/output-markdown` | PR comment renderer and CLI console renderer |
| `@kodeaman/output-html` | Self-contained HTML report with OWASP dashboard and theme support |
| `@kodeaman/output-sarif` | SARIF output for IDE and CI integration |
| `@kodeaman/owasp` | OWASP Top 10 scan orchestrator with per-category scanning and evidence gates |

### Integration Layer

| Package | Description |
|---------|-------------|
| `@kodeaman/mcp-server` | Model Context Protocol server for AI-assisted security scanning |

### Applications

| App | Description |
|-----|-------------|
| `@kodeaman/cli` | Command-line tool: `kodeaman scan`, `kodeaman owasp-scan`, `kodeaman init` |
| `@kodeaman/bot-github` | GitHub PR reviewer bot (Probot) |
| `@kodeaman/bot-gitlab` | GitLab MR reviewer bot (Hono) |
| `@kodeaman/docs-site` | Documentation website |

---

## MCP Server (Vibe Coding)

The `@kodeaman/mcp-server` package exposes KodeAman as a Model Context Protocol server, allowing AI coding assistants (Claude Code, Cursor, Windsurf, and others) to run security scans directly from the IDE.

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `scan` | Run a full security scan on a project directory |
| `owasp-scan` | Run an OWASP Top 10 structured scan |
| `preflight` | Check scanner availability before scanning |
| `list-scanners` | List all registered scanner adapters |
| `explain-finding` | Get a detailed bilingual explanation of a finding |
| `suggest-fix` | Get fix suggestions with code examples |
| `convert-sarif` | Convert scan results to SARIF format |
| `coverage-report` | Generate an OWASP category coverage report |

### Configuration

Add the MCP server to your AI coding assistant. For Claude Code, add to your MCP settings:

```json
{
  "mcpServers": {
    "kodeaman": {
      "command": "node",
      "args": ["path/to/kodeaman/packages/mcp-server/dist/index.js"]
    }
  }
}
```

The MCP server works without configuration files. When scanning a project that contains `package.json`, `package-lock.json`, or `pnpm-lock.yaml`, the npm audit adapter activates automatically.

---

## OWASP Top 10 Scan Mode

KodeAman supports structured security scanning organized by OWASP Top 10 (2021) categories A01 through A10. Findings are backed by scanner evidence -- a finding must include real scanner output before it appears in the report.

### Evidence Policy

- Findings require scanner evidence by default (`--no-evidence-gate` to override).
- Web findings require proof artifacts: HTML report, terminal snapshot, HTTP request, or HTTP response evidence.
- Evidence artifacts let users verify that findings came from real scanner runs.

### Usage

```bash
# Full OWASP Top 10 scan with HTML report
pnpm --filter @kodeaman/cli start -- owasp-scan --format html --output report.html

# Scan specific categories with confidence gate
pnpm --filter @kodeaman/cli start -- owasp-scan --categories A01,A03,A10 --confidence medium --format json
```

### Limitations

KodeAman only reports what configured scanners can observe. Missing scanner coverage produces blind spots. Screenshot evidence for web findings depends on scanner adapters providing HTML, terminal, or HTTP evidence blocks.

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 10
- Git

### Installation

```bash
git clone https://github.com/vibellabbs-code/kodeaman.git
cd kodeaman
pnpm install
pnpm run build
```

### Run a Local Scan

```bash
# Scan a project directory
pnpm --filter @kodeaman/cli start -- scan ./my-project

# OWASP Top 10 scan with HTML output
pnpm --filter @kodeaman/cli start -- owasp-scan --format html --output report.html
```

### Run Tests

```bash
pnpm test          # Run all tests
pnpm run typecheck # Type-check all packages
pnpm lint          # Lint all packages
```

---

## Open-Core Model

| Layer | License | Contents |
|-------|---------|----------|
| Core engine | Apache 2.0 | Scan pipeline, adapters, coaching, CLI, GitHub/GitLab bots, MCP server |
| Community presets | Apache 2.0 | Rule packs and lesson sets contributed by the community |
| Pro (future) | Commercial | Org dashboard, SSO, advanced analytics, priority support |

---

## Principles

- **Education over alerts** -- every finding is a teaching moment.
- **Bahasa-first, global-ready** -- internationalization from day one.
- **Pluggable** -- bring your own scanner, LLM, or lesson pack.
- **Privacy-respecting** -- your code stays on your infrastructure.
- **Community-driven** -- presets, lessons, and translations are open contributions.

---

## Contributing

We welcome contributions. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

We are looking for:

- **Indonesian developers** to shape coaching content.
- **Security engineers** to curate and validate rule packs.
- **Translators** for Bahasa Indonesia lesson content.
- **Educators** teaching secure coding at Indonesian universities.
- **Open-source contributors** interested in developer tooling.

---

## Pilot Program

We are running early pilot programs with Indonesian development teams. If your team wants early access, roadmap influence, or hands-on setup support, open a [Pilot Feedback issue](../../issues/new?template=pilot_feedback.yml) or contact the maintainers.

---

## License

[Apache License 2.0](./LICENSE)
