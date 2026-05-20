# Product Scope

AspidaSec is a website security scanner that helps developers identify, prioritize, and fix OWASP-related security risks in modern web applications.

This sentence is the product filter. Work that does not support scanning, prioritization, remediation, reporting, or CI workflow should not enter the MVP.

## Category

AspidaSec belongs in the website security scanning category.

It is CLI-first, developer-first, and report-first. It should feel useful in a terminal, pull request, CI job, and shared HTML report before it grows into a hosted product.

## Problem

Modern web teams have access to many security scanners, but the output is often hard to act on:

- Too many duplicate or low-priority findings.
- Weak context about affected files, endpoints, or proof.
- Remediation guidance that is too generic.
- Output that is hard to share in pull requests or CI.
- English-only guidance that can slow Indonesian teams.

AspidaSec focuses on the last-mile problem: turning scanner evidence into prioritized, practical remediation.

## Target Users

- Developers responsible for public-facing web applications.
- Small teams without a dedicated application security engineer.
- Indonesian developers who need clear Bahasa Indonesia remediation guidance.
- Agencies that need explainable reports for clients.
- Maintainers who want CI-friendly security checks before releases.

## Core Jobs

AspidaSec should help a user:

1. Scan a local project or deployed URL.
2. Identify OWASP-related website security risks.
3. Understand which findings matter most.
4. See evidence, affected files, endpoints, and reproduction context.
5. Apply practical fixes.
6. Export findings into HTML, Markdown, JSON, SARIF, CI logs, or PR comments.

## In Scope For MVP

- CLI scanning for local projects and website URLs.
- OWASP Top 10 oriented checks.
- ZAP dynamic scanning.
- npm, pnpm, or yarn dependency audit.
- Semgrep web application rules.
- Basic secret and risky configuration detection.
- Playwright crawling when needed for route discovery.
- Finding normalization and deduplication.
- Risk prioritization.
- Practical remediation guidance in Bahasa Indonesia and English.
- HTML, Markdown, JSON, and SARIF output.
- CI and PR integration.

## Out Of Scope For MVP

- Hosted dashboard.
- Multi-tenant backend.
- Authentication and RBAC.
- Enterprise policy management.
- Advanced analytics.
- Leaderboards and gamification-first flows.
- Attack simulation labs.
- Multi-agent research workflows.
- Custom IDEs.
- Cloud sync.
- Blockchain or tokenized workflows.

These ideas may be revisited later only after the CLI scan and report workflow is strong.

## Product Boundary Rule

Before adding a feature, ask:

1. Does it improve website scanning?
2. Does it improve prioritization?
3. Does it improve remediation?
4. Does it improve reporting?
5. Does it improve CI or PR adoption?

If the answer is no to all five, it does not belong in the MVP.
