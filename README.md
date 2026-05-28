# AspidaSec

[![CI](https://github.com/kaa911-syp/AspidaSec/actions/workflows/ci.yml/badge.svg)](https://github.com/kaa911-syp/AspidaSec/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![Release](https://img.shields.io/github/v/tag/kaa911-syp/AspidaSec?label=version&color=green)](https://github.com/kaa911-syp/AspidaSec/tags)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)
![pnpm](https://img.shields.io/badge/pnpm-workspaces-F69220?logo=pnpm)
[![Last Commit](https://img.shields.io/github/last-commit/kaa911-syp/AspidaSec)](https://github.com/kaa911-syp/AspidaSec/commits/main)

Website security scanning with practical remediation guidance.

AspidaSec scans modern web applications for OWASP-related risks, prioritizes findings that matter, and produces developer-ready fixes and reports.

![AspidaSec Concept Art](./assets/concept-art/nano-banana-v1-bioluminescent-jungle.jpg)

## Product Scope

AspidaSec is not an AI cybersecurity ecosystem, training platform, universal scanner, or dashboard-first product.

It is a CLI-first website security scanner for developers and small teams who need to answer:

- What security risks are present in this web application?
- Which findings should be fixed first?
- What evidence proves the issue exists?
- How do we fix it safely?
- How do we share the result in CI, pull requests, or team review?

The MVP only includes work that supports scanning, prioritization, remediation, reporting, or CI workflow.

## Who It Is For

- Developers maintaining public-facing websites and web apps
- Small product teams that need practical OWASP coverage without a dedicated security team
- Agencies and maintainers who need shareable security reports for client or team review
- CI users who want security output that is readable enough to act on

## Golden Path

The first product workflow is intentionally narrow:

```bash
aspidasec scan .
```

or:

```bash
aspidasec scan https://example.com
```

The scan should move through one clear path:

1. Accept a local project, GitHub checkout, or deployed URL.
2. Run website-focused checks: dependency audit, OWASP-oriented static checks, dynamic scan, route crawling, and basic secrets/config review.
3. Normalize and deduplicate findings.
4. Prioritize findings by severity, confidence, exploitability, public exposure, affected file or endpoint, and fix availability.
5. Generate practical remediation guidance.
6. Export a clean HTML report, Markdown report, PR comment, JSON, or SARIF.

If this path is excellent, AspidaSec has product value before any dashboard exists.

## MVP Feature Set

### Core Scanner

- OWASP Top 10 oriented checks
- ZAP dynamic scanning for deployed or locally running web apps
- npm, pnpm, or yarn dependency audit
- Semgrep web application rules
- Basic secret and risky configuration detection
- Playwright-assisted crawling for route discovery where useful

### Analysis

- Finding normalization into one schema
- Deduplication across scanners
- OWASP category mapping
- Severity and confidence normalization
- Risk prioritization for the top findings

### Guidance

- Finding summaries based on scanner evidence
- Practical remediation steps
- Safe code examples
- References to relevant standards or scanner evidence

### Output

- CLI output
- HTML report
- Markdown report
- PR comment output
- JSON and SARIF for CI and downstream tools

## Explicitly Not In MVP

These may become useful later, but they should not lead the product now:

- Hosted dashboard
- Multi-tenant backend
- Authentication or RBAC
- Team leaderboard
- Gamification-first workflows
- Attack simulation labs
- Multi-agent research workflows
- Custom IDEs
- Cloud sync
- Enterprise policy management

Dashboard, history, and collaboration code can exist in the repository, but the MVP story should remain CLI-first and report-first.

## Why AspidaSec Exists

Most security scanners fail developers at the last mile. They may detect issues, but the output is often noisy, duplicated, hard to prioritize, and difficult to turn into a safe fix.

AspidaSec focuses on the parts that make website security work actionable:

- **Evidence-first findings** - scanner output and reproducible evidence drive every issue.
- **Prioritized output** - the top risks are separated from background noise.
- **Fix-first guidance** - each important finding includes practical remediation, examples, and references.
- **CI-ready reports** - output is designed for pull requests, CI logs, HTML review, and SARIF consumers.

## Trust Model

AspidaSec must be trustworthy before it is clever.

AI or generated guidance must never invent vulnerabilities, severities, affected files, endpoints, evidence, or scanner names. Detection must come from scanners, repository analysis, configuration review, or explicit user-provided evidence.

The guidance layer may summarize, explain, translate, and suggest remediation. It must not fabricate findings.

See [docs/trust-model.md](./docs/trust-model.md) for the full rule set.

## Quick Start

### Local Project Scan

```bash
git clone https://github.com/kaa911-syp/AspidaSec.git
cd AspidaSec
pnpm install
pnpm run build

pnpm --filter @aspidasec/cli start -- scan ./my-project
```

### Website / OWASP Scan

```bash
pnpm --filter @aspidasec/cli start -- owasp-scan --format html --output report.html
```

### MCP Server

Add the MCP server to an AI coding assistant such as Claude Code, Cursor, or Windsurf:

```json
{
  "mcpServers": {
    "aspidasec": {
      "command": "node",
      "args": ["path/to/AspidaSec/packages/mcp-server/dist/index.js"]
    }
  }
}
```

The MCP server exposes scan, OWASP scan, preflight, scanner listing, finding explanation, fix suggestion, SARIF conversion, and coverage-report tools.

## CLI Commands

```bash
# Core scanning
aspidasec scan [path-or-url]        # Run a website security scan
aspidasec owasp-scan [options]      # Run OWASP Top 10 structured scan
aspidasec init                      # Generate .aspidasec.yml config

# Output formats
aspidasec scan ./project --format markdown
aspidasec scan ./project --format json
aspidasec scan ./project --format sarif
aspidasec scan ./project --format html

# Language
aspidasec scan ./project --language id
aspidasec scan ./project --language en
```

## Configuration

AspidaSec uses `.aspidasec.yml` in the scanned project root.

```yaml
language: id

scanners:
  semgrep: true
  npmAudit: true
  zapBaseline: false

output:
  markdown: true
  html: false
  sarif: false

owasp:
  enabled: false
  categories: [A01, A02, A03, A04, A05, A06, A07, A08, A09, A10]
  parallel: false
  confidenceGate: low
  evidenceGate: true
  failOnSeverity: high

environment:
  skipWslCheck: false
  scannerTimeout: 120000
```

See [examples/configs/](./examples/configs/) for annotated configurations.

## Architecture

AspidaSec is organized around four product layers:

| Layer | Responsibility | Key packages |
|-------|----------------|--------------|
| Scanner layer | Run website security scanners and collect raw evidence | `adapters-*`, `owasp`, `cli` |
| Analysis layer | Normalize, deduplicate, map, and prioritize findings | `schema`, `core`, `prioritizer`, `config` |
| Guidance layer | Explain findings and produce practical remediation | `coaching`, `i18n`, `lessons` |
| Output layer | Render reports for developers and CI systems | `output-markdown`, `output-html`, `output-sarif`, `mcp-server` |

```text
AspidaSec/
├── apps/
│   ├── cli/               # primary developer entry point
│   ├── bot-github/        # PR comment workflow
│   ├── bot-gitlab/        # MR comment workflow
│   ├── bot-gitea/         # Gitea / Forgejo PR workflow
│   └── docs-site/         # public website
├── packages/
│   ├── schema/            # normalized finding types and validators
│   ├── core/              # scan pipeline, dedupe, plugin system
│   ├── config/            # .aspidasec.yml loader and validation
│   ├── prioritizer/       # risk scoring
│   ├── owasp/             # OWASP Top 10 orchestration
│   ├── adapters-*/        # scanner integrations
│   ├── coaching/          # remediation templates
│   ├── i18n/              # Bahasa Indonesia and English text
│   ├── output-*/          # Markdown, HTML, and SARIF renderers
│   └── mcp-server/        # AI assistant integration
├── docs/                  # product, setup, and architecture docs
├── examples/              # demo projects and config examples
└── docker-compose.yml     # self-hosted bot deployment
```

See [docs/architecture.md](./docs/architecture.md) for the product architecture.

## Product Documents

| Document | Purpose |
|----------|---------|
| [Product Scope](./docs/product-scope.md) | Defines what AspidaSec is, who it serves, and what it will not do now |
| [MVP](./docs/mvp.md) | Freezes the first usable version and defers non-essential features |
| [Architecture](./docs/architecture.md) | Separates scanner, analysis, guidance, and output layers |
| [Product Philosophy](./docs/product-philosophy.md) | Defines the principles behind the product decisions |
| [Trust Model](./docs/trust-model.md) | Documents evidence-first security and AI safety boundaries |
| [Golden Path](./docs/golden-path.md) | Defines the one workflow that must feel excellent first |

## Existing Setup Docs

| Guide | Description |
|-------|-------------|
| [Getting Started](./docs/getting-started.md) | CLI installation, configuration, and option reference |
| [GitHub Bot Setup](./docs/github-bot-setup.md) | GitHub App registration and PR comments |
| [GitLab Bot Setup](./docs/gitlab-bot-setup.md) | GitLab webhook setup and MR comments |
| [Self-Hosting](./docs/self-hosting/deployment.md) | Docker Compose deployment |
| [MCP Integration](./docs/mcp-integration.md) | MCP setup for AI coding assistants |
| [SARIF IDE Integration](./docs/sarif-ide-integration.md) | SARIF output for IDEs and code scanning |

## Tests

```bash
pnpm test
pnpm run typecheck
pnpm lint
```

GitHub Actions runs install, build, typecheck, test, and lint on pushes and pull requests to `main`.

## License

[Apache License 2.0](./LICENSE)

Copyright 2026 Vibellabbs Code.
