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

## Bahasa Indonesia

Cross-Origin Resource Sharing (CORS) mengontrol domain eksternal mana yang bisa mengakses API kamu. CORS yang salah konfigurasi bisa mengekspos API ke akses tidak sah dari situs web berbahaya.

### Kesalahan Umum

```php
// RENTAN — Izinkan semua origin di Laravel
// config/cors.php
'allowed_origins' => ['*'],
'supports_credentials' => true,  // Wildcard + credentials = berbahaya

// RENTAN — Merefleksikan header Origin
'allowed_origins' => [$request->header('Origin')],
```

```javascript
// RENTAN — Izinkan semua origin di Express
app.use(cors());  // Default ke Access-Control-Allow-Origin: *

// RENTAN — Merefleksikan origin tanpa validasi
app.use(cors({
  origin: (origin, cb) => cb(null, true),  // Menerima origin apa saja
  credentials: true,
}));
```

### Cara Memperbaiki

```php
// AMAN — Origin spesifik di Laravel
// config/cors.php
'allowed_origins' => [
    'https://appkamu.com',
    'https://admin.appkamu.com',
],
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
'allowed_headers' => ['Content-Type', 'Authorization'],
'supports_credentials' => true,
```

```javascript
// AMAN — Whitelist origin spesifik di Express
const allowedOrigins = [
  'https://appkamu.com',
  'https://admin.appkamu.com',
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

### Poin Penting

- Jangan pernah gunakan wildcard (`*`) dengan credentials
- Whitelist origin spesifik daripada merefleksikan header Origin
- Batasi method dan header yang diizinkan sesuai kebutuhan API
- Untuk API publik tanpa credentials, wildcard origin boleh digunakan
- Tes konfigurasi CORS dengan `curl -H "Origin: https://evil.com"`
