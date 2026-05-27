# Vulnerable Components / Komponen Rentan

## English

Using components (libraries, frameworks, dependencies) with known vulnerabilities is one of the most common and impactful security risks. Attackers can exploit well-documented vulnerabilities in outdated packages to compromise your application.

### Common Vulnerabilities

```json
// VULNERABLE — Outdated package.json with known CVEs
{
  "dependencies": {
    "lodash": "4.17.15",       // Prototype pollution CVE-2020-8203
    "express": "4.16.0",       // Multiple security patches missed
    "jsonwebtoken": "8.0.0"    // Algorithm confusion vulnerability
  }
}
```

```bash
# VULNERABLE — Never running dependency audits
npm install  # Installing without checking for vulnerabilities
```

```javascript
// VULNERABLE — Importing abandoned/unmaintained packages
const moment = require('moment');  // Deprecated, no security patches
```

### How to Fix It

```bash
# SAFE — Regular dependency auditing
npm audit                    # Check for known vulnerabilities
npm audit fix                # Auto-fix compatible patches
npm audit fix --force        # Fix with major version bumps (test thoroughly!)

# SAFE — Using automated tools
npx npm-check-updates -u     # Update to latest versions
```

```json
// SAFE — Using lockfiles and pinned versions
{
  "dependencies": {
    "lodash": "^4.17.21",
    "express": "^4.19.2"
  },
  "overrides": {
    "vulnerable-transitive-dep": ">=2.0.0"
  }
}
```

```yaml
# SAFE — GitHub Dependabot configuration (.github/dependabot.yml)
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### Key Takeaways

- Run `npm audit` regularly and in CI/CD pipelines
- Keep dependencies updated — use Dependabot or Renovate
- Remove unused dependencies to reduce attack surface
- Use lockfiles (package-lock.json, pnpm-lock.yaml) for reproducible builds
- Monitor advisories: GitHub Security Advisories, Snyk, npm advisories

---

