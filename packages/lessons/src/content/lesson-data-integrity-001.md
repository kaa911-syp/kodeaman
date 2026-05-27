# Data Integrity Failures / Kegagalan Integritas Data

## English

Data integrity failures occur when code or infrastructure does not properly verify the integrity of data, software updates, or CI/CD pipelines. This includes insecure deserialization, unsigned updates, and compromised build pipelines.

### Common Vulnerabilities

```javascript
// VULNERABLE — Loading scripts without Subresource Integrity (SRI)
<script src="https://cdn.example.com/lib.js"></script>

// VULNERABLE — Insecure deserialization of user input
const data = JSON.parse(req.body.data);
eval(data.callback);  // Arbitrary code execution

// VULNERABLE — No integrity check on downloaded artifacts
const response = await fetch('https://releases.example.com/v2.tar.gz');
const buffer = await response.arrayBuffer();
await extractTarball(buffer);  // No hash verification
```

```yaml
# VULNERABLE — CI/CD pipeline without pinned actions
jobs:
  build:
    steps:
      - uses: actions/checkout@main  # Unpinned — could be compromised
      - run: npm install && npm run build
      - run: npm publish  # Publishing without verification
```

### How to Fix It

```html
<!-- SAFE — Using SRI for external scripts -->
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8w"
  crossorigin="anonymous">
</script>
```

```javascript
// SAFE — Verify integrity of downloaded artifacts
import { createHash } from 'crypto';

const response = await fetch('https://releases.example.com/v2.tar.gz');
const buffer = Buffer.from(await response.arrayBuffer());
const hash = createHash('sha256').update(buffer).digest('hex');

if (hash !== EXPECTED_HASH) {
  throw new Error('Integrity check failed — artifact may be tampered');
}
await extractTarball(buffer);
```

```yaml
# SAFE — CI/CD with pinned actions and signed artifacts
jobs:
  build:
    steps:
      - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1
      - run: npm ci  # Uses lockfile for reproducible installs
      - run: npm run build
      - name: Sign artifact
        run: cosign sign-blob --key cosign.key dist/app.tar.gz
```

### Key Takeaways

- Use Subresource Integrity (SRI) for all external scripts and styles
- Pin CI/CD actions to specific commit SHAs, not tags or branches
- Verify checksums/signatures for all downloaded artifacts
- Use `npm ci` instead of `npm install` in CI pipelines
- Sign release artifacts and verify signatures before deployment

---

