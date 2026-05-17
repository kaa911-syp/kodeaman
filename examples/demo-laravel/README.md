# Demo: Laravel Security Scan

This demo shows how to use AspidaSec to scan a Laravel project for security issues.

## What's included

- `.aspidasec.yml` — AspidaSec configuration with the `laravel` preset
- `routes/web.php` — Routes with intentional security issues for testing
- `composer.json` — Project metadata

## How to run

```bash
# From the repository root
cd examples/demo-laravel

# Run AspidaSec scan with Laravel preset
aspidasec scan --preset laravel

# Run OWASP scan in Bahasa Indonesia
aspidasec owasp-scan --preset laravel --language id --format html
```

## Expected findings

| Finding | Category | Severity |
|---------|----------|----------|
| Raw SQL query without binding | A03 Injection | High |
| CSRF protection disabled | A01 Broken Access Control | High |
| Debug mode enabled in production | A05 Security Misconfiguration | Medium |
| Mass assignment vulnerability | A04 Insecure Design | Medium |

## Configuration

See `.aspidasec.yml` in this directory for the full configuration with inline comments.

## Notes

- This is a **demo project** with intentional vulnerabilities for testing
- No real Laravel installation is needed — AspidaSec scans source files directly
- The vulnerabilities demonstrate typical Laravel security issues
