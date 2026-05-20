# Getting Started with AspidaSec

AspidaSec is a CLI-first website security scanner for developers. It scans modern web applications with established tools, normalizes findings into one format, prioritizes the risks that matter, and delivers practical remediation guidance in English and Bahasa Indonesia.

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
git clone https://github.com/kaa911-syp/AspidaSec.git
cd AspidaSec

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## Quick Start

### 1. Initialize configuration

Run the interactive init wizard in your project directory:

```bash
aspidasec init
```

This creates a `.aspidasec.yml` file with your chosen language, scanners, and preset. Example output:

```yaml
language: id
scanners:
  semgrep: true
  zapBaseline: false
prioritization:
  maxFindingsInComment: 3
  failOnSeverity: critical
output:
  markdown: true
  sarif: false
  json: false
```

### 2. Run a scan

```bash
# Basic scan with Semgrep
aspidasec scan

# Scan with JSON output
aspidasec scan --format json

# Scan with Bahasa Indonesia output
aspidasec scan --language id

# Scan using a framework preset
aspidasec scan --preset laravel
```

### 3. Run an OWASP Top 10 scan

```bash
# Full OWASP scan with HTML report
aspidasec owasp-scan

# Scan specific categories only
aspidasec owasp-scan --categories A01,A03,A06

# Scan with Markdown output in Bahasa Indonesia
aspidasec owasp-scan --format markdown --language id

# Scan with high confidence gate
aspidasec owasp-scan --confidence high

# Parallel category scanning
aspidasec owasp-scan --parallel
```

The OWASP scan produces:
- An HTML evidence report (default) saved to `aspidasec-owasp-report.html`
- A coverage dashboard showing findings per OWASP category
- Evidence-backed findings only (no AI-fabricated results)

### 4. Use pre-existing scanner output

If you already have Semgrep or ZAP JSON output, pass it directly:

```bash
# From Semgrep JSON
aspidasec scan --input semgrep-results.json

# From ZAP baseline JSON
aspidasec scan --input zap-baseline.json
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `aspidasec init` | Interactive config wizard — creates `.aspidasec.yml` |
| `aspidasec scan` | Run security scan with configured scanners |
| `aspidasec owasp-scan` | Run structured OWASP Top 10 scan |

### `aspidasec scan` options

| Option | Description | Default |
|--------|-------------|---------|
| `-c, --config <path>` | Path to config file | `.aspidasec.yml` in cwd |
| `-f, --format <fmt>` | Output format: `markdown`, `json`, `sarif` | `markdown` |
| `-i, --input <file>` | Pre-existing scanner output file | — |
| `-l, --language <lang>` | Language: `en` or `id` | from config |
| `-p, --preset <name>` | Framework preset: `laravel`, `node-express`, `wordpress` | — |
| `-v, --verbose` | Verbose output | `false` |

### `aspidasec owasp-scan` options

| Option | Description | Default |
|--------|-------------|---------|
| `-c, --config <path>` | Path to config file | `.aspidasec.yml` in cwd |
| `-f, --format <fmt>` | Output format: `html`, `markdown`, `json` | `html` |
| `-l, --language <lang>` | Language: `en` or `id` | from config |
| `-p, --preset <name>` | Framework preset | — |
| `-o, --output <file>` | Output file path | `aspidasec-owasp-report.html` |
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

AspidaSec reads `.aspidasec.yml` from the project root. See [example configurations](../examples/configs/) for annotated templates covering CLI, GitHub bot, GitLab bot, and OWASP mode.

## Next Steps

- [GitHub Bot Setup](./github-bot-setup.md) — automated PR security reviews
- [GitLab Bot Setup](./gitlab-bot-setup.md) — automated MR security reviews
- [Self-Hosting & Deployment](./self-hosting/deployment.md) — Docker Compose deployment
- [Example Configurations](../examples/configs/) — annotated `.aspidasec.yml` templates
