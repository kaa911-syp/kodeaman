# Authentication Best Practices / Praktik Terbaik Autentikasi

## English

Authentication is how your application verifies who a user is. Weak authentication is a top attack vector — broken auth consistently appears in the OWASP Top 10.

### Common Vulnerabilities

```php
// VULNERABLE — Weak password validation in Laravel
$request->validate([
    'password' => 'required|min:4',  // Too short, no complexity
]);

// VULNERABLE — No rate limiting on login
Route::post('/login', [AuthController::class, 'login']);
```

```javascript
// VULNERABLE — Storing passwords in plain text
const user = { email, password: req.body.password };
await db.collection('users').insertOne(user);

// VULNERABLE — Weak JWT configuration
const token = jwt.sign(payload, 'secret', { algorithm: 'none' });
```

### How to Fix It

```php
// SAFE — Strong password rules in Laravel
$request->validate([
    'password' => ['required', 'min:8', 'confirmed',
        Password::min(8)->mixedCase()->numbers()->symbols()],
]);

// SAFE — Rate limiting with Laravel
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');  // 5 attempts per minute

// SAFE — Use Laravel's built-in auth hashing
$user->password = Hash::make($request->password);
```

```javascript
// SAFE — Hash passwords with bcrypt
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(req.body.password, 12);

// SAFE — Strong JWT configuration
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  algorithm: 'HS256',
  expiresIn: '1h',
});

// SAFE — Rate limiting with express-rate-limit
import rateLimit from 'express-rate-limit';
const loginLimiter = rateLimit({ windowMs: 60000, max: 5 });
app.post('/login', loginLimiter, loginHandler);
```

### Key Takeaways

- Always hash passwords with bcrypt (cost factor 10+)
- Implement rate limiting on authentication endpoints
- Use strong JWT algorithms (HS256/RS256), never `none`
- Set appropriate session/token expiry times
- Implement multi-factor authentication for sensitive actions

---

