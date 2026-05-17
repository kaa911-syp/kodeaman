# Demo: Node/Express Security Scan

This demo shows how to use AspidaSec to scan a Node.js/Express project for security issues.

## What's included

- `.aspidasec.yml` — AspidaSec configuration with the `node-express` preset
- `server.js` — A deliberately vulnerable Express server for testing
- `package.json` — Project metadata with an outdated dependency for npm audit testing

## How to run

```bash
# From the repository root
cd examples/demo-node-express

# Install dependencies
npm install

# Run AspidaSec scan
aspidasec scan --preset node-express

# Run OWASP scan with HTML report
aspidasec owasp-scan --preset node-express --format html
```

## Expected findings

| Finding | Category | Severity |
|---------|----------|----------|
| SQL injection in query parameter | A03 Injection | High |
| Missing helmet security headers | A05 Security Misconfiguration | Medium |
| Outdated `express` version | A06 Vulnerable Components | Medium |
| Hardcoded secret in environment | A07 Auth Failures | High |

## Configuration

See `.aspidasec.yml` in this directory for the full configuration with inline comments.

## Notes

- This is a **demo project** with intentional vulnerabilities for testing
- Do not deploy this code to production
- The vulnerabilities demonstrate what AspidaSec detects and how it coaches remediation
