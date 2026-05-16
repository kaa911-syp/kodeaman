# Secure Configuration / Konfigurasi yang Aman

## English

Misconfiguration is one of the easiest vulnerabilities to exploit and one of the most common to find. Debug mode in production, exposed admin panels, and default credentials give attackers an easy way in.

### Common Mistakes

```php
// VULNERABLE — Debug mode enabled in production
// .env
APP_DEBUG=true
APP_ENV=production

// VULNERABLE — Exposed telescope/debugbar in production
// config/telescope.php — no gate defined
```

```javascript
// VULNERABLE — Detailed error messages in production
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack,  // Leaks internal paths and code structure
  });
});

// VULNERABLE — Default credentials
const adminPassword = 'admin123';
```

### How to Fix It

```php
// SAFE — Proper production config in Laravel
// .env
APP_DEBUG=false
APP_ENV=production

// Restrict Telescope to local/specific IPs
// app/Providers/TelescopeServiceProvider.php
protected function gate() {
    Gate::define('viewTelescope', function ($user) {
        return in_array($user->email, ['admin@yourapp.com']);
    });
}
```

```javascript
// SAFE — Generic error messages in production
app.use((err, req, res, next) => {
  console.error(err);  // Log internally
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// SAFE — Use environment-specific config
const config = {
  debug: process.env.NODE_ENV !== 'production',
  logLevel: process.env.LOG_LEVEL || 'error',
};
```

### Key Takeaways

- Never run debug mode in production
- Remove or restrict access to debug tools (Telescope, Debugbar)
- Use generic error messages for users, detailed logs for developers
- Change all default credentials before deploying
- Regularly audit your configuration against security baselines

---

## Bahasa Indonesia

Miskonfigurasi adalah salah satu kerentanan yang paling mudah dieksploitasi dan paling sering ditemukan. Mode debug di produksi, panel admin yang terekspos, dan kredensial default memberi penyerang jalan masuk yang mudah.

### Kesalahan Umum

```php
// RENTAN — Mode debug aktif di produksi
// .env
APP_DEBUG=true
APP_ENV=production

// RENTAN — Telescope/debugbar terekspos di produksi
// config/telescope.php — tidak ada gate yang didefinisikan
```

```javascript
// RENTAN — Pesan error detail di produksi
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack,  // Membocorkan path internal dan struktur kode
  });
});

// RENTAN — Kredensial default
const adminPassword = 'admin123';
```

### Cara Memperbaiki

```php
// AMAN — Konfigurasi produksi yang benar di Laravel
// .env
APP_DEBUG=false
APP_ENV=production

// Batasi Telescope ke lokal/IP tertentu
// app/Providers/TelescopeServiceProvider.php
protected function gate() {
    Gate::define('viewTelescope', function ($user) {
        return in_array($user->email, ['admin@appkamu.com']);
    });
}
```

```javascript
// AMAN — Pesan error generik di produksi
app.use((err, req, res, next) => {
  console.error(err);  // Log secara internal
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// AMAN — Gunakan konfigurasi sesuai environment
const config = {
  debug: process.env.NODE_ENV !== 'production',
  logLevel: process.env.LOG_LEVEL || 'error',
};
```

### Poin Penting

- Jangan pernah jalankan mode debug di produksi
- Hapus atau batasi akses ke tool debug (Telescope, Debugbar)
- Gunakan pesan error generik untuk pengguna, log detail untuk developer
- Ubah semua kredensial default sebelum deploy
- Audit konfigurasi secara rutin terhadap baseline keamanan
