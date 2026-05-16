# Cryptography Basics / Dasar-Dasar Kriptografi

## English

Using weak or outdated cryptographic algorithms puts your data at risk. MD5, SHA1, and DES are broken — modern applications should use strong algorithms for hashing, encryption, and key generation.

### Common Mistakes

```php
// VULNERABLE — MD5 for password hashing
$hash = md5($password);  // Broken, rainbow table attacks trivial

// VULNERABLE — SHA1 for integrity checks
$checksum = sha1($fileContents);  // Collision attacks demonstrated

// VULNERABLE — Weak encryption
$encrypted = openssl_encrypt($data, 'DES-ECB', $key);  // DES is broken, ECB leaks patterns
```

```javascript
// VULNERABLE — MD5 for any security purpose
import crypto from 'crypto';
const hash = crypto.createHash('md5').update(password).digest('hex');

// VULNERABLE — Predictable random values for tokens
const token = Math.random().toString(36);  // Not cryptographically secure
```

### How to Fix It

```php
// SAFE — Use bcrypt for passwords in Laravel
$hash = Hash::make($password);  // bcrypt with auto-salt
if (Hash::check($inputPassword, $hash)) { /* valid */ }

// SAFE — SHA256+ for integrity checks
$checksum = hash('sha256', $fileContents);

// SAFE — AES-256-GCM for encryption
$encrypted = encrypt($data);  // Laravel's built-in uses AES-256-CBC with HMAC
```

```javascript
// SAFE — bcrypt for passwords
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(input, hash);

// SAFE — SHA256 for integrity
const checksum = crypto.createHash('sha256').update(data).digest('hex');

// SAFE — Cryptographically secure random values
const token = crypto.randomBytes(32).toString('hex');

// SAFE — AES-256-GCM for encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
```

### Quick Reference

| Purpose | Do NOT Use | Use Instead |
|---------|-----------|-------------|
| Password hashing | MD5, SHA1, SHA256 | bcrypt, Argon2 |
| Integrity checks | MD5, SHA1 | SHA-256, SHA-512 |
| Encryption | DES, 3DES, RC4, ECB mode | AES-256-GCM, ChaCha20 |
| Random tokens | Math.random(), rand() | crypto.randomBytes(), random_bytes() |

### Key Takeaways

- Use bcrypt or Argon2 for password hashing, never MD5/SHA
- Use AES-256-GCM for symmetric encryption
- Always use cryptographically secure random number generators
- Keep cryptographic libraries up to date
- Never implement your own cryptography

---

## Bahasa Indonesia

Menggunakan algoritma kriptografi yang lemah atau usang membuat data kamu berisiko. MD5, SHA1, dan DES sudah tidak aman — aplikasi modern harus menggunakan algoritma yang kuat untuk hashing, enkripsi, dan pembuatan kunci.

### Kesalahan Umum

```php
// RENTAN — MD5 untuk hashing password
$hash = md5($password);  // Sudah rusak, serangan rainbow table sangat mudah

// RENTAN — SHA1 untuk pengecekan integritas
$checksum = sha1($fileContents);  // Serangan collision sudah didemonstrasikan

// RENTAN — Enkripsi lemah
$encrypted = openssl_encrypt($data, 'DES-ECB', $key);  // DES rusak, ECB bocorkan pola
```

```javascript
// RENTAN — MD5 untuk tujuan keamanan apa pun
import crypto from 'crypto';
const hash = crypto.createHash('md5').update(password).digest('hex');

// RENTAN — Nilai random yang bisa ditebak untuk token
const token = Math.random().toString(36);  // Tidak aman secara kriptografi
```

### Cara Memperbaiki

```php
// AMAN — Gunakan bcrypt untuk password di Laravel
$hash = Hash::make($password);  // bcrypt dengan auto-salt
if (Hash::check($inputPassword, $hash)) { /* valid */ }

// AMAN — SHA256+ untuk pengecekan integritas
$checksum = hash('sha256', $fileContents);

// AMAN — AES-256-GCM untuk enkripsi
$encrypted = encrypt($data);  // Bawaan Laravel pakai AES-256-CBC dengan HMAC
```

```javascript
// AMAN — bcrypt untuk password
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(input, hash);

// AMAN — SHA256 untuk integritas
const checksum = crypto.createHash('sha256').update(data).digest('hex');

// AMAN — Nilai random yang aman secara kriptografi
const token = crypto.randomBytes(32).toString('hex');

// AMAN — AES-256-GCM untuk enkripsi
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
```

### Referensi Cepat

| Tujuan | JANGAN Gunakan | Gunakan Ini |
|--------|---------------|-------------|
| Hashing password | MD5, SHA1, SHA256 | bcrypt, Argon2 |
| Pengecekan integritas | MD5, SHA1 | SHA-256, SHA-512 |
| Enkripsi | DES, 3DES, RC4, mode ECB | AES-256-GCM, ChaCha20 |
| Token random | Math.random(), rand() | crypto.randomBytes(), random_bytes() |

### Poin Penting

- Gunakan bcrypt atau Argon2 untuk hashing password, jangan pernah MD5/SHA
- Gunakan AES-256-GCM untuk enkripsi simetris
- Selalu gunakan generator angka random yang aman secara kriptografi
- Jaga library kriptografi tetap up-to-date
- Jangan pernah implementasi kriptografi sendiri
