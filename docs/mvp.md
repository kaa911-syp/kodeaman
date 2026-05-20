# MVP

The AspidaSec MVP is a CLI-first website security scanner with practical remediation guidance and shareable reports.

The MVP is not the full repository. Some packages may already exist for future capabilities, but the first usable product should be judged only by the golden path.

## MVP Goal

A developer can run one command against a web app, receive a prioritized security report, and fix at least one real issue without needing a security expert.

## Primary Interface

The primary interface is the CLI:

```bash
aspidasec scan .
aspidasec scan https://example.com
```

CLI-first is the right first interface because it is:

- Fast to build and test.
- Natural for developers.
- Easy to run in CI.
- Easy to document.
- Compatible with open-source adoption.
- Independent of hosted infrastructure.

## Required MVP Capabilities

### Scan Inputs

- Local project directory.
- Deployed URL.
- CI checkout.

GitHub repository scanning can be represented as a local checkout in the first version.

### Scanner Coverage

- ZAP for dynamic web checks.
- npm, pnpm, or yarn audit for dependency risk.
- Semgrep for web application static checks.
- Basic secret and configuration exposure checks.
- Playwright crawling for route discovery when useful.

### Analysis

- Normalize findings into the shared schema.
- Deduplicate equivalent findings.
- Map findings to OWASP categories where possible.
- Rank findings by severity, confidence, exploitability, public exposure, production relevance, and fix availability.
- Highlight the top risks first.

### Guidance

- Summarize the finding.
- Explain why it matters.
- Show affected file, endpoint, package, or route.
- Provide practical remediation.
- Include safe examples when available.
- Support Bahasa Indonesia and English.

### Output

- CLI summary.
- HTML report.
- Markdown report.
- PR comment body.
- JSON output.
- SARIF output for code scanning tools.

## Deferred Features

These are useful, but not MVP blockers:

- Hosted dashboard.
- Historical analytics.
- Team collaboration.
- User accounts.
- RBAC.
- Advanced policy management.
- Marketplace publishing.
- VS Code marketplace release.
- Leaderboards, XP, streaks, or quests as primary workflows.
- Multi-project cloud scanning.

## MVP Success Criteria

- A scan completes in under five minutes for a small to medium web app.
- The top five findings are easy to understand.
- Duplicate findings are reduced.
- Each top finding has evidence and practical fix guidance.
- Bahasa Indonesia output is clear enough for local developer teams.
- CI output is readable and actionable.
- HTML reports are shareable in team review.

## MVP Failure Signals

- Users cannot tell what to fix first.
- Reports are technically correct but too noisy to act on.
- AI text appears to invent evidence.
- The dashboard receives more attention than scan/report quality.
- Adding scanners increases confusion instead of confidence.
- Users need a security expert to interpret the report.
