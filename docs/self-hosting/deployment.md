# Self-Hosting & Deployment

This guide covers deploying KodeAman's GitHub and GitLab bots using Docker Compose.

## Architecture

```
┌──────────────┐     webhook      ┌──────────────┐
│   GitHub /   │ ──────────────>  │  bot-github   │ :3000
│   GitLab     │                  │  bot-gitlab   │ :3001
└──────────────┘                  └──────┬───────┘
                                         │
                                  ┌──────┴───────┐
                                  │   postgres    │ :5432
                                  └──────────────┘
```

Both bots connect to a shared PostgreSQL database. The database stores webhook event metadata for deduplication and audit purposes.

## Prerequisites

- Docker 20+ and Docker Compose v2
- A publicly accessible host (or webhook proxy like ngrok/Cloudflare Tunnel)
- GitHub App credentials (see [GitHub Bot Setup](../github-bot-setup.md))
- GitLab access token (see [GitLab Bot Setup](../gitlab-bot-setup.md))

## 1. Configure Environment

Create a `.env` file in the repository root:

```bash
# ── GitHub Bot ──
APP_ID=12345
PRIVATE_KEY_PATH=./private-key.pem
WEBHOOK_SECRET=github-webhook-secret
PORT=3000

# ── GitLab Bot ──
GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx
GITLAB_WEBHOOK_SECRET=gitlab-webhook-secret
# GITLAB_URL=https://gitlab.yourcompany.com   # For self-hosted GitLab

# ── Database ──
POSTGRES_DB=kodeaman
POSTGRES_USER=kodeaman
POSTGRES_PASSWORD=change-this-in-production

# ── General ──
LOG_LEVEL=info
```

## 2. Docker Compose

The repository includes a `docker-compose.yml` at the root:

```yaml
services:
  bot-github:
    build:
      context: .
      dockerfile: apps/bot-github/Dockerfile
    env_file: .env
    ports:
      - "3000:3000"
    depends_on:
      - postgres

  bot-gitlab:
    build:
      context: .
      dockerfile: apps/bot-gitlab/Dockerfile
    env_file: .env
    ports:
      - "3001:3001"
    depends_on:
      - postgres

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: kodeaman
      POSTGRES_USER: kodeaman
      POSTGRES_PASSWORD: kodeaman
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Start all services

```bash
docker compose up -d
```

### Start only one bot

```bash
# GitHub bot only
docker compose up -d bot-github postgres

# GitLab bot only
docker compose up -d bot-gitlab postgres
```

### View logs

```bash
docker compose logs -f bot-github
docker compose logs -f bot-gitlab
```

### Rebuild after code changes

```bash
docker compose build --no-cache
docker compose up -d
```

## 3. Scanner Availability

The bot containers need scanners available at runtime:

| Scanner | How to include |
|---------|---------------|
| Semgrep | Install via `pip install semgrep` in the Dockerfile |
| npm audit | Available by default with Node.js |
| ZAP | Mount Docker socket or run ZAP as a sidecar container |

Example Dockerfile addition for Semgrep:

```dockerfile
RUN pip install semgrep
```

## 4. Webhook Routing

### Public host

Point your GitHub App or GitLab webhook URL directly:

- GitHub: `https://your-host:3000/api/github/webhooks`
- GitLab: `https://your-host:3001/api/gitlab/webhooks`

### Behind a reverse proxy (nginx)

```nginx
server {
    listen 443 ssl;
    server_name kodeaman.yourcompany.com;

    location /api/github/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api/gitlab/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Local development with ngrok

```bash
# GitHub bot
ngrok http 3000

# GitLab bot
ngrok http 3001
```

Update the webhook URL in GitHub/GitLab settings to the ngrok URL.

## 5. Production Checklist

| Item | Action |
|------|--------|
| Database password | Change `POSTGRES_PASSWORD` from default |
| Webhook secrets | Use strong random values for `WEBHOOK_SECRET` and `GITLAB_WEBHOOK_SECRET` |
| Private key | Store GitHub App `.pem` file securely (Docker secret or mounted volume) |
| Access token | Rotate GitLab token regularly |
| TLS | Use HTTPS via reverse proxy or cloud load balancer |
| Log level | Set `LOG_LEVEL=warn` in production to reduce noise |
| Backups | Back up the PostgreSQL `pgdata` volume |
| Monitoring | Check webhook delivery status in GitHub/GitLab settings |

## 6. Updating

```bash
git pull origin main
docker compose build --no-cache
docker compose up -d
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Container fails to start | Check `docker compose logs <service>` for error details |
| Database connection refused | Ensure `postgres` container is healthy: `docker compose ps` |
| Webhook not received | Verify the webhook URL is publicly reachable and the secret matches |
| Scanner not found | Install the scanner in the bot's Dockerfile |
| Port conflict | Change the host port mapping in `docker-compose.yml` |

## Next Steps

- [GitHub Bot Setup](../github-bot-setup.md) — register and configure the GitHub App
- [GitLab Bot Setup](../gitlab-bot-setup.md) — set up GitLab webhook and token
- [Getting Started](../getting-started.md) — local CLI usage
