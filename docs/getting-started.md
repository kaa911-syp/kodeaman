# Getting Started with KodeAman

KodeAman is a security coach agent for developers. It scans your code with established tools (Semgrep, ZAP, npm audit), normalizes findings into a single format, and delivers prioritized remediation coaching in English and Bahasa Indonesia.

This guide covers local CLI setup. For PR bot setup see [GitHub Bot Setup](./github-bot-setup.md) or [GitLab Bot Setup](./gitlab-bot-setup.md).

## Prerequisites

- **Node.js** 18 or later
- **pnpm** 8 or later
- At least one scanner installed:
  - [Semgrep](https://semgrep.dev/docs/getting-started/) (SAST)
  - [ZAP](https://www.zaproxy.org/docs/docker/baseline-scan/) (DAST, via Docker)
  - npm audit (built into npm, no extra install)

## Installation

```bash
# Clone the repository
git clone https://github.com/kodeaman/kodeaman.git
cd kodeaman

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## Quick Start

### 1. Initialize configuration

Run the interactive init wizard in your project directory:

```bash
kodeaman init
```

This creates a `.kodeaman.yml` file with your chosen language, scanners, and preset. Example output:

```yaml
language: id
scanners:
  semgrep: true
  zapBaseline: false
prioritization:
  maxFindingsInComment: 3
  failOnSeverity: critical
gamification:
  enabled: true
output:
  markdown: true
  sarif: false
  json: false
```

### 2. Run a scan

```bash
# Basic scan with Semgrep
kodeaman scan

# Scan with JSON output
kodeaman scan --format json

# Scan with Bahasa Indonesia output
kodeaman scan --language id

# Scan using a framework preset
kodeaman scan --preset laravel
```

### 3. Run an OWASP Top 10 scan

```bash
# Full OWASP scan with HTML report
kodeaman owasp-scan

# Scan specific categories only
kodeaman owasp-scan --categories A01,A03,A06

# Scan with Markdown output in Bahasa Indonesia
kodeaman owasp-scan --format markdown --language id

# Scan with high confidence gate
kodeaman owasp-scan --confidence high

# Parallel category scanning
kodeaman owasp-scan --parallel
```

The OWASP scan produces:
- An HTML evidence report (default) saved to `kodeaman-owasp-report.html`
- A coverage dashboard showing findings per OWASP category
- Evidence-backed findings only (no AI-fabricated results)

### 4. Use pre-existing scanner output

If you already have Semgrep or ZAP JSON output, pass it directly:

```bash
# From Semgrep JSON
kodeaman scan --input semgrep-results.json

# From ZAP baseline JSON
kodeaman scan --input zap-baseline.json
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `kodeaman init` | Interactive config wizard — creates `.kodeaman.yml` |
| `kodeaman scan` | Run security scan with configured scanners |
| `kodeaman owasp-scan` | Run structured OWASP Top 10 scan |

### `kodeaman scan` options

| Option | Description | Default |
|--------|-------------|---------|
| `-c, --config <path>` | Path to config file | `.kodeaman.yml` in cwd |
| `-f, --format <fmt>` | Output format: `markdown`, `json`, `sarif` | `markdown` |
| `-i, --input <file>` | Pre-existing scanner output file | — |
| `-l, --language <lang>` | Language: `en` or `id` | from config |
| `-p, --preset <name>` | Framework preset: `laravel`, `node-express`, `wordpress` | — |
| `-v, --verbose` | Verbose output | `false` |

### `kodeaman owasp-scan` options

| Option | Description | Default |
|--------|-------------|---------|
| `-c, --config <path>` | Path to config file | `.kodeaman.yml` in cwd |
| `-f, --format <fmt>` | Output format: `html`, `markdown`, `json` | `html` |
| `-l, --language <lang>` | Language: `en` or `id` | from config |
| `-p, --preset <name>` | Framework preset | — |
| `-o, --output <file>` | Output file path | `kodeaman-owasp-report.html` |
| `--parallel` | Run categories in parallel | `false` |
| `--categories <list>` | Comma-separated categories (e.g. `A01,A03,A06`) | all A01–A10 |
| `--confidence <level>` | Confidence gate: `low`, `medium`, `high` | `low` |
| `--no-evidence-gate` | Include findings without scanner evidence | evidence required |
| `--skip-wsl-check` | Skip WSL availability check on Windows | `false` |
| `-y, --yes` | Auto-accept setup guidance prompts | `false` |
| `-v, --verbose` | Verbose output | `false` |

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Scan completed, no findings at or above `failOnSeverity` threshold |
| `1` | Findings detected at or above `failOnSeverity`, or scan error |

## Configuration

KodeAman reads `.kodeaman.yml` from the project root. See [example configurations](../examples/configs/) for annotated templates covering CLI, GitHub bot, GitLab bot, and OWASP mode.

## Next Steps

- [GitHub Bot Setup](./github-bot-setup.md) — automated PR security reviews
- [GitLab Bot Setup](./gitlab-bot-setup.md) — automated MR security reviews
- [Self-Hosting & Deployment](./self-hosting/deployment.md) — Docker Compose deployment
- [Example Configurations](../examples/configs/) — annotated `.kodeaman.yml` templates
