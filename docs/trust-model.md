# Trust Model

AspidaSec is a security product. Trust is more important than clever output.

The core rule:

> AI and generated guidance must never invent findings.

## Detection Sources

A finding may only exist if it comes from one of these sources:

- Scanner output.
- Repository analysis.
- Dependency audit data.
- Configuration review.
- Dynamic scan evidence.
- User-provided evidence.
- Deterministic rules maintained in the codebase.

## What AI Or Guidance May Do

The guidance layer may:

- Summarize a scanner-backed finding.
- Explain impact.
- Translate guidance into Bahasa Indonesia or English.
- Suggest remediation steps.
- Provide safe code examples.
- Link related references.
- Rephrase technical scanner output for developers.

## What AI Or Guidance Must Not Do

The guidance layer must not invent:

- Vulnerabilities.
- Affected files.
- Affected endpoints.
- HTTP requests or responses.
- Stack traces.
- Scanner names.
- Severity.
- Confidence.
- CWE IDs.
- OWASP categories.
- Exploitability.
- Evidence artifacts.
- Fix availability.

## Evidence Requirements

High-quality findings should include as many of these as possible:

- Scanner source.
- Severity.
- Confidence.
- Affected file, package, route, or endpoint.
- CWE or OWASP category.
- Reproduction context.
- HTTP evidence for web findings.
- Dependency advisory metadata for dependency findings.
- Clear remediation path.

## Report Language

Reports should distinguish between:

- Confirmed scanner evidence.
- Inferred prioritization.
- Suggested remediation.
- Missing or unavailable evidence.

Do not present suggestions as detection proof.

## Failure Handling

If a scanner fails, AspidaSec should say so. It should not silently replace missing scanner output with generated findings.

Acceptable behavior:

- "ZAP did not run because Docker was unavailable."
- "npm audit was skipped because no supported lockfile was found."
- "Evidence is missing, so this finding was filtered by the evidence gate."

Unacceptable behavior:

- Creating a fake dynamic finding because ZAP was unavailable.
- Assigning an endpoint that was never observed.
- Reporting a vulnerability only because it sounds likely.

## User Trust Contract

AspidaSec should earn trust by being explicit about:

- What was scanned.
- Which scanners ran.
- Which scanners failed or were skipped.
- What evidence supports each top finding.
- What remains unverified.

Trustworthy limits are better than confident guesses.
