# CORS Configuration / Konfigurasi CORS

## English

Cross-Origin Resource Sharing (CORS) controls which external domains can access your API. Misconfigured CORS can expose your API to unauthorized access from malicious websites.

### Common Mistakes

```php
// VULNERABLE — Allow all origins in Laravel
// config/cors.php
'allowed_origins' => ['*'],
'supports_credentials' => true,  // Wildcard + credentials = dangerous

// VULNERABLE — Reflecting the Origin header
'allowed_origins' => [$request->header('Origin')],
```

```javascript
// VULNERABLE — Allow all origins in Express
app.use(cors());  // Defaults to Access-Control-Allow-Origin: *

// VULNERABLE — Reflecting origin without validation
app.use(cors({
  origin: (origin, cb) => cb(null, true),  // Accepts any origin
  credentials: true,
}));
```

### How to Fix It

```php
// SAFE — Specific origins in Laravel
// config/cors.php
'allowed_origins' => [
    'https://yourapp.com',
    'https://admin.yourapp.com',
],
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
'allowed_headers' => ['Content-Type', 'Authorization'],
'supports_credentials' => true,
```

```javascript
// SAFE — Whitelist specific origins in Express
const allowedOrigins = [
  'https://yourapp.com',
  'https://admin.yourapp.com',
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Key Takeaways

- Never use wildcard (`*`) with credentials
- Whitelist specific origins instead of reflecting the Origin header
- Restrict allowed methods and headers to what your API actually needs
- For public APIs without credentials, wildcard origin is acceptable
- Test your CORS config with `curl -H "Origin: https://evil.com"`

---

