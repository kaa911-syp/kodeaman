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

## Bahasa Indonesia

Kegagalan integritas data terjadi ketika kode atau infrastruktur tidak memverifikasi integritas data, pembaruan perangkat lunak, atau pipeline CI/CD dengan benar. Ini termasuk deserialisasi tidak aman, pembaruan yang tidak ditandatangani, dan pipeline build yang dikompromikan.

### Kerentanan Umum

```javascript
// RENTAN — Memuat script tanpa Subresource Integrity (SRI)
<script src="https://cdn.example.com/lib.js"></script>

// RENTAN — Deserialisasi tidak aman dari input pengguna
const data = JSON.parse(req.body.data);
eval(data.callback);  // Eksekusi kode sembarang

// RENTAN — Tidak ada pengecekan integritas pada artefak yang diunduh
const response = await fetch('https://releases.example.com/v2.tar.gz');
const buffer = await response.arrayBuffer();
await extractTarball(buffer);  // Tidak ada verifikasi hash
```

```yaml
# RENTAN — Pipeline CI/CD tanpa action yang di-pin
jobs:
  build:
    steps:
      - uses: actions/checkout@main  # Tidak di-pin — bisa dikompromikan
      - run: npm install && npm run build
      - run: npm publish  # Publish tanpa verifikasi
```

### Cara Memperbaiki

```html
<!-- AMAN — Menggunakan SRI untuk script eksternal -->
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8w"
  crossorigin="anonymous">
</script>
```

```javascript
// AMAN — Verifikasi integritas artefak yang diunduh
import { createHash } from 'crypto';

const response = await fetch('https://releases.example.com/v2.tar.gz');
const buffer = Buffer.from(await response.arrayBuffer());
const hash = createHash('sha256').update(buffer).digest('hex');

if (hash !== EXPECTED_HASH) {
  throw new Error('Pengecekan integritas gagal — artefak mungkin telah dirusak');
}
await extractTarball(buffer);
```

```yaml
# AMAN — CI/CD dengan action yang di-pin dan artefak yang ditandatangani
jobs:
  build:
    steps:
      - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1
      - run: npm ci  # Menggunakan lockfile untuk instalasi yang dapat direproduksi
      - run: npm run build
      - name: Tandatangani artefak
        run: cosign sign-blob --key cosign.key dist/app.tar.gz
```

### Poin Penting

- Gunakan Subresource Integrity (SRI) untuk semua script dan style eksternal
- Pin CI/CD action ke SHA commit spesifik, bukan tag atau branch
- Verifikasi checksum/signature untuk semua artefak yang diunduh
- Gunakan `npm ci` daripada `npm install` di pipeline CI
- Tandatangani artefak release dan verifikasi signature sebelum deployment
