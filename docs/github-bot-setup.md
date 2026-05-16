# GitHub Bot Setup

KodeAman's GitHub bot (`@kodeaman/bot-github`) automatically reviews pull requests for security issues using Probot. When a PR is opened or updated, the bot runs configured scanners and posts a comment with prioritized findings and remediation coaching.

## Prerequisites

- A GitHub App registered on your organization or repository
- Node.js 18+
- Docker (recommended for deployment) or a Node.js host
- At least one scanner installed in the bot's runtime environment

## 1. Register a GitHub App

1. Go to **Settings → Developer Settings → GitHub Apps → New GitHub App**
2. Set the following permissions:
   - **Pull requests**: Read & Write (to post comments)
   - **Contents**: Read (to access changed files)
   - **Checks**: Read & Write (optional, for check annotations)
3. Subscribe to these events:
   - `pull_request` (opened, synchronize, reopened)
4. Generate and download a **private key** (`.pem` file)
5. Note the **App ID** and **Installation ID**

## 2. Configure Environment

Create a `.env` file in the repository root (or set environment variables):

```bash
# Required
APP_ID=12345
PRIVATE_KEY_PATH=./private-key.pem
WEBHOOK_SECRET=your-webhook-secret

# Optional
GITHUB_CLIENT_ID=Iv1.abc123
GITHUB_CLIENT_SECRET=secret123
LOG_LEVEL=info
PORT=3000
```

## 3. Configure `.kodeaman.yml`

Add a `.kodeaman.yml` file to each repository you want the bot to review:

```yaml
language: id

scanners:
  semgrep: true
  zapBaseline: false
  npmAudit: true

prioritization:
  maxFindingsInComment: 3
  failOnSeverity: high

gamification:
  enabled: true

output:
  markdown: true
```

### OWASP Mode

To enable OWASP-structured PR comments:

```yaml
owasp:
  enabled: true
  categories: [A01, A03, A06, A07]
  confidenceGate: medium
  evidenceGate: true
  failOnSeverity: high
```

When `owasp.enabled: true`, the bot uses the OWASP scan orchestrator instead of the standard pipeline. PR comments are organized by OWASP category with evidence cards.

## 4. Deploy

### Option A: Docker Compose (recommended)

```bash
# From repository root
docker compose up -d bot-github
```

The bot runs on port 3000 by default. Set up a webhook proxy (ngrok, Cloudflare Tunnel, or a reverse proxy) to forward GitHub webhook events to `http://your-host:3000/api/github/webhooks`.

### Option B: Direct Node.js

```bash
pnpm install
pnpm build
cd apps/bot-github
node dist/index.js
```

## 5. Verify

1. Open a pull request on a connected repository
2. The bot should post a comment within 30–60 seconds with:
   - Scan status summary
   - Top findings by severity
   - Remediation coaching (bilingual if configured)
   - OWASP category breakdown (if OWASP mode enabled)
   - Gamification badges and XP (if enabled)
3. On subsequent pushes, the bot updates the existing comment

## PR Comment Structure

The bot comment includes:

| Section | Content |
|---------|---------|
| **Header** | Scan status, finding count, scanners used |
| **Top Findings** | Up to `maxFindingsInComment` highest-priority findings |
| **Finding Detail** | Severity, confidence, file location, evidence, remediation |
| **Coaching** | Bilingual remediation guidance (en + id) |
| **OWASP Dashboard** | Category coverage table (OWASP mode only) |
| **Gamification** | XP earned, badges, streak info |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Bot does not respond to PRs | Check webhook delivery in GitHub App settings → Advanced |
| Comment is empty | Verify scanners are installed in the bot's runtime |
| `PRIVATE_KEY_PATH` error | Ensure the `.pem` file path is correct and readable |
| Duplicate comments | The bot uses a hidden marker to find and update its comment; check for multiple bot instances |

## Next Steps

- [Getting Started](./getting-started.md) — local CLI usage
- [Self-Hosting & Deployment](./self-hosting/deployment.md) — production Docker setup
- [Example Configurations](../examples/configs/) — annotated `.kodeaman.yml` for GitHub bot
