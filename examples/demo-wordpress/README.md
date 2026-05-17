# Demo: WordPress Security Scan

This demo shows how to use AspidaSec to scan a WordPress plugin for security issues.

## What's included

- `.aspidasec.yml` — AspidaSec configuration with the `wordpress` preset
- `plugin.php` — A deliberately vulnerable WordPress plugin for testing

## How to run

```bash
# From the repository root
cd examples/demo-wordpress

# Run AspidaSec scan with WordPress preset
aspidasec scan --preset wordpress

# Run OWASP scan
aspidasec owasp-scan --preset wordpress --format html
```

## Expected findings

| Finding | Category | Severity |
|---------|----------|----------|
| Direct `$wpdb->query()` without `prepare()` | A03 Injection | High |
| Missing nonce verification | A01 Broken Access Control | High |
| Unescaped output with `echo` | A03 Injection (XSS) | Medium |
| Missing capability check | A01 Broken Access Control | Medium |

## Configuration

See `.aspidasec.yml` in this directory for the full configuration with inline comments.

## Notes

- This is a **demo project** with intentional vulnerabilities for testing
- No real WordPress installation is needed — AspidaSec scans source files directly
- The vulnerabilities demonstrate typical WordPress plugin security issues
