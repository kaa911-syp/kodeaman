# GitLab Bot Setup

AspidaSec's GitLab bot (`@aspidasec/bot-gitlab`) automatically reviews merge requests for website security issues using a Hono-based webhook service. When an MR is opened or updated, the bot runs configured scanners and posts a comment with prioritized findings and remediation guidance.

## Prerequisites

- A GitLab project or group with webhook access
- A GitLab personal access token or project access token with `api` scope
- Node.js 18+
- Docker (recommended for deployment) or a Node.js host
- At least one scanner installed in the bot's runtime environment

## 1. Create Access Token

1. Go to **Settings → Access Tokens** (project or group level)
2. Create a token with:
   - **Scopes**: `api` (to post MR comments and read repository)
   - **Expiration**: set a reasonable expiry and rotate regularly
3. Note the token value

## 2. Configure Environment

Create a `.env` file in the repository root (or set environment variables):

```bash
# Required
GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx
GITLAB_WEBHOOK_SECRET=your-webhook-secret

# Optional
GITLAB_URL=https://gitlab.com           # Self-hosted GitLab URL
LOG_LEVEL=info
PORT=3001
```

## 3. Configure `.aspidasec.yml`

Add a `.aspidasec.yml` file to each repository you want the bot to review:

```yaml
language: id

scanners:
  semgrep: true
  zapBaseline: false
  npmAudit: true

prioritization:
  maxFindingsInComment: 3
  failOnSeverity: high

output:
  markdown: true
```

### OWASP Mode

To enable OWASP-structured MR comments:

```yaml
owasp:
  enabled: true
  categories: [A01, A03, A06, A07]
  confidenceGate: medium
  evidenceGate: true
  failOnSeverity: high
```

When `owasp.enabled: true`, the bot uses the OWASP scan orchestrator. MR comments are organized by OWASP category with evidence cards.

## 4. Set Up Webhook

1. Go to **Settings → Webhooks** in your GitLab project
2. Add a webhook:
   - **URL**: `http://your-host:3001/api/gitlab/webhooks`
   - **Secret token**: same as `GITLAB_WEBHOOK_SECRET`
   - **Trigger events**: Merge request events
3. Click **Add webhook**

## 5. Deploy

### Option A: Docker Compose (recommended)

```bash
# From repository root
docker compose up -d bot-gitlab
```

The bot runs on port 3001 by default.

### Option B: Direct Node.js

```bash
pnpm install
pnpm build
cd apps/bot-gitlab
node dist/index.js
```

## 6. Verify

1. Open a merge request on a connected project
2. The bot should post a note within 30–60 seconds with:
   - Scan status summary
   - Top findings by severity
   - Bilingual remediation guidance
   - OWASP category breakdown (if OWASP mode enabled)
3. On subsequent pushes, the bot updates the existing note

## MR Comment Structure

The bot note includes:

| Section | Content |
|---------|---------|
| **Header** | Scan status, finding count, scanners used |
| **Top Findings** | Up to `maxFindingsInComment` highest-priority findings |
| **Finding Detail** | Severity, confidence, file location, evidence, remediation |
| **Guidance** | Bilingual remediation guidance (en + id) |
| **OWASP Dashboard** | Category coverage table (OWASP mode only) |

## Self-Hosted GitLab

For self-hosted GitLab instances, set the `GITLAB_URL` environment variable:

```bash
GITLAB_URL=https://gitlab.yourcompany.com
```

The bot uses this URL for all API calls instead of `https://gitlab.com`.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Bot does not respond to MRs | Check webhook delivery in Settings → Webhooks → Recent Deliveries |
| `401 Unauthorized` | Verify the access token has `api` scope and is not expired |
| Comment is empty | Verify scanners are installed in the bot's runtime |
| Duplicate notes | The bot uses a hidden marker to find and update its note; check for multiple bot instances |

## Next Steps

- [Getting Started](./getting-started.md) — local CLI usage
- [Self-Hosting & Deployment](./self-hosting/deployment.md) — production Docker setup
- [Example Configurations](../examples/configs/) — annotated `.aspidasec.yml` for GitLab bot
