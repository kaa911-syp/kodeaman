# Golden Path

The golden path is the one workflow that must feel excellent before AspidaSec expands.

## Target Workflow

```bash
aspidasec scan .
```

or:

```bash
aspidasec scan https://example.com
```

The output should help a developer decide what to fix first.

## User Journey

### 1. Input

The user provides one target:

- Local project directory.
- CI checkout.
- Deployed URL.

### 2. Scan

AspidaSec runs the relevant checks:

- Dependency audit.
- OWASP-oriented static checks.
- Dynamic web scan.
- Playwright crawling when useful.
- Basic secrets and risky config review.

### 3. Results

AspidaSec groups and prioritizes findings:

- Severity.
- Confidence.
- Affected endpoint, file, package, or route.
- Scanner evidence.
- OWASP category.
- Reproduction information where available.

### 4. Fix Guidance

AspidaSec explains what to do:

- Why the issue matters.
- What to change.
- Safe example.
- Reference material.
- Bahasa Indonesia or English explanation.

### 5. Export

AspidaSec writes output for the user's workflow:

- CLI summary.
- HTML report.
- Markdown report.
- PR comment.
- JSON.
- SARIF.

## Opinionated Report Shape

The first screen or first section of a report should not be a raw finding dump.

Recommended sections:

1. Scan summary.
2. Top 5 risks.
3. Fix first.
4. Likely exploitable.
5. Public exposure.
6. Production blocking.
7. Dependency risk.
8. Full findings.
9. Scanner coverage.
10. Skipped or failed checks.

## Finding Card Requirements

Each important finding should show:

- Title.
- Severity.
- Confidence.
- Priority rank.
- OWASP category.
- Affected endpoint, file, package, or route.
- Scanner source.
- Evidence.
- Why it matters.
- Practical fix.
- Safe example when available.
- References.

## Golden Path Success Criteria

- The scan starts with one obvious command.
- The report makes the top risks obvious.
- The user can tell what evidence supports each top finding.
- The user can tell what to fix first.
- The user can share the report in a team review.
- CI output is readable without opening a dashboard.

## Golden Path Anti-Goals

Do not optimize these before the golden path is strong:

- Account creation.
- Hosted dashboard.
- Multi-project analytics.
- Custom workflow builders.
- Team leaderboards.
- Advanced enterprise controls.

The golden path is the product foundation.
