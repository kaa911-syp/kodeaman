# Insecure Design / Desain Tidak Aman

## English

Insecure design refers to fundamental flaws in the architecture and design of an application — not implementation bugs, but missing or ineffective security controls that should have been planned from the start.

### Common Vulnerabilities

```javascript
// VULNERABLE — No rate limiting on password reset
app.post('/reset-password', async (req, res) => {
  const token = generateToken();
  await sendResetEmail(req.body.email, token);
  res.json({ message: 'Reset email sent' });
});

// VULNERABLE — No business logic validation
app.post('/transfer', authMiddleware, async (req, res) => {
  // Allows transferring any amount, even negative
  await transferFunds(req.user.id, req.body.to, req.body.amount);
  res.json({ success: true });
});
```

```php
// VULNERABLE — Predictable resource IDs without authorization check
Route::get('/invoices/{id}', function ($id) {
    return Invoice::findOrFail($id); // Any user can access any invoice
});
```

### How to Fix It

```javascript
// SAFE — Rate limiting and abuse prevention
const resetLimiter = rateLimit({ windowMs: 3600000, max: 3 });
app.post('/reset-password', resetLimiter, async (req, res) => {
  const token = generateSecureToken();
  await sendResetEmail(req.body.email, token);
  // Always return same response to prevent user enumeration
  res.json({ message: 'If that email exists, a reset link was sent' });
});

// SAFE — Business logic validation
app.post('/transfer', authMiddleware, async (req, res) => {
  const amount = Number(req.body.amount);
  if (amount <= 0 || amount > MAX_TRANSFER || amount > req.user.balance) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  await transferFunds(req.user.id, req.body.to, amount);
});
```

```php
// SAFE — Authorization check with policy
Route::get('/invoices/{id}', function ($id) {
    $invoice = Invoice::findOrFail($id);
    $this->authorize('view', $invoice); // Check ownership
    return $invoice;
});
```

### Key Takeaways

- Use threat modeling during design phase (STRIDE, DREAD)
- Implement defense in depth — multiple security layers
- Apply the principle of least privilege
- Design business logic validation into the architecture
- Use secure design patterns: authorization checks, rate limiting, input boundaries

---

## Bahasa Indonesia

Desain tidak aman mengacu pada kelemahan fundamental dalam arsitektur dan desain aplikasi — bukan bug implementasi, tetapi kontrol keamanan yang hilang atau tidak efektif yang seharusnya direncanakan sejak awal.

### Kerentanan Umum

```javascript
// RENTAN — Tidak ada rate limiting pada reset password
app.post('/reset-password', async (req, res) => {
  const token = generateToken();
  await sendResetEmail(req.body.email, token);
  res.json({ message: 'Email reset terkirim' });
});

// RENTAN — Tidak ada validasi logika bisnis
app.post('/transfer', authMiddleware, async (req, res) => {
  // Memungkinkan transfer jumlah berapa pun, bahkan negatif
  await transferFunds(req.user.id, req.body.to, req.body.amount);
  res.json({ success: true });
});
```

```php
// RENTAN — ID resource yang bisa ditebak tanpa pengecekan otorisasi
Route::get('/invoices/{id}', function ($id) {
    return Invoice::findOrFail($id); // Semua user bisa akses semua invoice
});
```

### Cara Memperbaiki

```javascript
// AMAN — Rate limiting dan pencegahan penyalahgunaan
const resetLimiter = rateLimit({ windowMs: 3600000, max: 3 });
app.post('/reset-password', resetLimiter, async (req, res) => {
  const token = generateSecureToken();
  await sendResetEmail(req.body.email, token);
  // Selalu kembalikan respons yang sama untuk mencegah enumerasi pengguna
  res.json({ message: 'Jika email tersebut ada, link reset telah dikirim' });
});

// AMAN — Validasi logika bisnis
app.post('/transfer', authMiddleware, async (req, res) => {
  const amount = Number(req.body.amount);
  if (amount <= 0 || amount > MAX_TRANSFER || amount > req.user.balance) {
    return res.status(400).json({ error: 'Jumlah tidak valid' });
  }
  await transferFunds(req.user.id, req.body.to, amount);
});
```

```php
// AMAN — Pengecekan otorisasi dengan policy
Route::get('/invoices/{id}', function ($id) {
    $invoice = Invoice::findOrFail($id);
    $this->authorize('view', $invoice); // Cek kepemilikan
    return $invoice;
});
```

### Poin Penting

- Gunakan threat modeling pada fase desain (STRIDE, DREAD)
- Implementasikan pertahanan berlapis — beberapa lapisan keamanan
- Terapkan prinsip hak akses minimum
- Rancang validasi logika bisnis ke dalam arsitektur
- Gunakan pola desain aman: pengecekan otorisasi, rate limiting, batasan input
