# Security Logging & Monitoring / Logging & Monitoring Keamanan

## English

Insufficient logging and monitoring allows attackers to go undetected, persist in systems, and pivot to other targets. Without proper security logs and alerts, breaches can remain undiscovered for months.

### Common Vulnerabilities

```javascript
// VULNERABLE — No logging of security events
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body.email, req.body.password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
    // No record of failed login attempt!
  }
  req.session.user = user;
  res.json({ success: true });
});

// VULNERABLE — Logging sensitive data
logger.info('User login', {
  email: req.body.email,
  password: req.body.password,  // PII/credential in logs!
  creditCard: user.creditCard,  // PII in logs!
});

// VULNERABLE — No monitoring or alerting
// Failed logins, privilege escalations, and data exports
// happen silently with no alerts
```

### How to Fix It

```javascript
// SAFE — Comprehensive security event logging
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body.email, req.body.password);
  if (!user) {
    securityLogger.warn('login_failed', {
      email: maskEmail(req.body.email),  // Masked PII
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString(),
    });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  securityLogger.info('login_success', {
    userId: user.id,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
  req.session.user = user;
  res.json({ success: true });
});
```

```javascript
// SAFE — Structured logging with PII redaction
import pino from 'pino';

const logger = pino({
  redact: {
    paths: ['password', 'creditCard', 'ssn', 'token'],
    censor: '[REDACTED]',
  },
});

// What to log (security events):
// - Authentication: login, logout, failed attempts
// - Authorization: access denied, privilege changes
// - Data access: sensitive data queries, exports, bulk operations
// - System: config changes, admin actions, API key usage
```

```javascript
// SAFE — Alerting on suspicious patterns
class SecurityMonitor {
  async checkFailedLogins(userId, threshold = 5, windowMinutes = 10) {
    const count = await getFailedLoginCount(userId, windowMinutes);
    if (count >= threshold) {
      await alert({
        severity: 'high',
        event: 'brute_force_suspected',
        userId,
        count,
        action: 'Account temporarily locked',
      });
      await lockAccount(userId, 30); // Lock for 30 minutes
    }
  }
}
```

### Key Takeaways

- Log all authentication and authorization events
- Never log passwords, tokens, credit cards, or other PII
- Use structured logging (JSON) for machine-parseable logs
- Set up alerts for: brute force, privilege escalation, unusual data access
- Retain security logs for at least 90 days
- Test your logging and monitoring — ensure alerts actually fire

---

## Bahasa Indonesia

Logging dan monitoring yang tidak memadai memungkinkan penyerang tidak terdeteksi, bertahan di sistem, dan berpindah ke target lain. Tanpa log keamanan dan alert yang benar, pelanggaran bisa tidak ditemukan selama berbulan-bulan.

### Kerentanan Umum

```javascript
// RENTAN — Tidak ada logging event keamanan
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body.email, req.body.password);
  if (!user) {
    return res.status(401).json({ error: 'Kredensial tidak valid' });
    // Tidak ada catatan percobaan login gagal!
  }
  req.session.user = user;
  res.json({ success: true });
});

// RENTAN — Mencatat data sensitif
logger.info('User login', {
  email: req.body.email,
  password: req.body.password,  // PII/kredensial di log!
  creditCard: user.creditCard,  // PII di log!
});

// RENTAN — Tidak ada monitoring atau alerting
// Login gagal, eskalasi privilege, dan ekspor data
// terjadi tanpa suara tanpa alert
```

### Cara Memperbaiki

```javascript
// AMAN — Logging event keamanan yang komprehensif
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body.email, req.body.password);
  if (!user) {
    securityLogger.warn('login_failed', {
      email: maskEmail(req.body.email),  // PII yang di-mask
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString(),
    });
    return res.status(401).json({ error: 'Kredensial tidak valid' });
  }

  securityLogger.info('login_success', {
    userId: user.id,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
  req.session.user = user;
  res.json({ success: true });
});
```

```javascript
// AMAN — Structured logging dengan redaksi PII
import pino from 'pino';

const logger = pino({
  redact: {
    paths: ['password', 'creditCard', 'ssn', 'token'],
    censor: '[REDACTED]',
  },
});

// Yang harus di-log (event keamanan):
// - Autentikasi: login, logout, percobaan gagal
// - Otorisasi: akses ditolak, perubahan privilege
// - Akses data: query data sensitif, ekspor, operasi massal
// - Sistem: perubahan config, aksi admin, penggunaan API key
```

```javascript
// AMAN — Alerting pada pola mencurigakan
class SecurityMonitor {
  async checkFailedLogins(userId, threshold = 5, windowMinutes = 10) {
    const count = await getFailedLoginCount(userId, windowMinutes);
    if (count >= threshold) {
      await alert({
        severity: 'high',
        event: 'brute_force_suspected',
        userId,
        count,
        action: 'Akun dikunci sementara',
      });
      await lockAccount(userId, 30); // Kunci selama 30 menit
    }
  }
}
```

### Poin Penting

- Log semua event autentikasi dan otorisasi
- Jangan pernah log password, token, kartu kredit, atau PII lainnya
- Gunakan structured logging (JSON) untuk log yang dapat diparsing mesin
- Atur alert untuk: brute force, eskalasi privilege, akses data yang tidak biasa
- Simpan log keamanan minimal 90 hari
- Tes logging dan monitoring Anda — pastikan alert benar-benar terkirim
