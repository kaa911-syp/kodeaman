# KodeAman

**Open-core security coach agent for Indonesian developers.**

> "Kode Aman" (Bahasa Indonesia) = "Secure Code"

---

## The Problem

Most SAST/DAST tools dump hundreds of findings, offer English-only guidance, and assume senior-level security knowledge. Indonesian dev teams — startups, campus labs, government digitisation projects — end up ignoring the noise or copy-pasting fixes they don't understand. Vulnerabilities stay open; learning never happens.

## The Solution

KodeAman is a **security coach agent** that:

1. **Scans** your code with pluggable adapters (Semgrep, ZAP, and more).
2. **Prioritises** findings by real-world risk, not raw severity.
3. **Coaches** developers in Bahasa Indonesia (or English) with contextual explanations, fix suggestions, and micro-lessons.
4. **Gamifies** progress — XP, streaks, leaderboards — so secure coding becomes a habit.
5. **Lives where you work**: GitHub bot, GitLab bot, CLI, or CI pipeline.

## Who It's For

- Indonesian startups shipping fast and worried about OWASP Top 10.
- University CS programs teaching secure development.
- Government digital-service teams meeting compliance requirements.
- Any dev team that wants actionable, educational security feedback — not just a wall of CVEs.

## v0.1 Features (Sprint 0-2)

- Semgrep SAST adapter with finding normalisation.
- Risk-based prioritiser (CVSS context + reachability heuristics).
- Coaching engine with Bahasa Indonesia micro-lessons for OWASP Top 10.
- GitHub PR bot that posts inline coaching comments.
- CLI for local scans with Markdown reports.
- XP and streak tracking (local JSON, upgradeable to Postgres).
- Community preset packs: `laravel-id`, `express-id`, `wordpress-id`.

## Open-Core Model

| Layer | License | What's included |
|-------|---------|----------------|
| **Core engine** | Apache 2.0 | Scan pipeline, adapters, coaching, CLI, GitHub/GitLab bots |
| **Community presets** | Apache 2.0 | Rule packs and lesson sets contributed by the community |
| **Pro (future)** | Commercial | Org dashboard, SSO, advanced analytics, priority support |

## Principles

- **Education over alerts** — every finding is a teaching moment.
- **Bahasa-first, global-ready** — i18n from day one.
- **Pluggable** — bring your own scanner, LLM, or lesson pack.
- **Privacy-respecting** — your code stays on your infra.
- **Community-driven** — presets, lessons, and translations are open contributions.

## Getting Started

```bash
# Clone the repo
git clone https://github.com/kodeaman/kodeaman.git
cd kodeaman

# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run the CLI
pnpm --filter @kodeaman/cli start -- scan ./my-project

# Run the OWASP Top 10 2021 scanner in A01-A10 order
pnpm --filter @kodeaman/cli start -- owasp-scan --format html --output kodeaman-owasp-report.html
```

### OWASP Top 10 evidence policy

`owasp-scan` scans and reports OWASP Top 10 2021 categories in canonical order: A01 Broken Access Control through A10 Server-Side Request Forgery. Findings are not invented by AI: by default, a finding must include scanner evidence before it appears in the report. Use `--no-evidence-gate` only when you intentionally want to inspect raw scanner output that may be incomplete.

For web findings, KodeAman highlights the need for screenshot-equivalent proof: an HTML report artifact, terminal snapshot, HTTP request, or HTTP response evidence. These artifacts let users verify that the finding came from a real scanner run instead of a generated claim.

On Windows, if Linux/WSL is not available, `owasp-scan` asks whether to show WSL setup guidance so deeper Semgrep/ZAP-style scanning can run in a Linux-compatible environment. In non-interactive CI, it skips the prompt and continues with available scanners; pass `--yes` to show the guidance automatically.

Example focused scan:

```bash
pnpm --filter @kodeaman/cli start -- owasp-scan --categories A01,A03,A10 --confidence medium --format json
```

Known limitations: KodeAman only reports what configured scanners can observe, so missing scanner coverage can produce blind spots. Screenshots are treated as required stakeholder evidence for web findings, but capture depends on scanner adapters providing HTML, terminal, or HTTP evidence blocks.

> Full setup guide coming soon in `docs/`.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Early Contributors Wanted

KodeAman is in its earliest days. We're looking for:

- **Indonesian developers** who want to shape the coaching content.
- **Security engineers** who can help curate and validate rule packs.
- **Translators** for Bahasa Indonesia lesson content.
- **Educators** teaching secure coding at Indonesian universities.
- **Open-source enthusiasts** who want to build developer tools.

If any of this sounds like you, open an issue, start a discussion, or reach out!

## Pilot Program

We're running early pilot programs with Indonesian dev teams. If your team wants to:

- Get early access to KodeAman.
- Shape the product roadmap with direct feedback.
- Receive hands-on support setting up your security coaching pipeline.

Open a [Pilot Feedback issue](../../issues/new?template=pilot_feedback.yml) or reach out to the maintainers.

## License

[Apache License 2.0](./LICENSE)
