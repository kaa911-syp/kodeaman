# Secret Management / Manajemen Secret

## English

Hardcoded secrets — API keys, database passwords, tokens — in source code are one of the most common security mistakes. Once committed to version control, secrets are extremely difficult to fully remove and can be found by anyone with repository access.

### Common Mistakes

```php
// VULNERABLE — Hardcoded database credentials in Laravel
// config/database.php
'mysql' => [
    'host' => '127.0.0.1',
    'username' => 'root',
    'password' => 'my_secret_password_123',  // NEVER do this
],
```

```javascript
// VULNERABLE — API key in source code
const stripe = require('stripe')('sk_live_abc123xyz789');

// VULNERABLE — Secret in a constant
const JWT_SECRET = 'super-secret-key-12345';
```

### How to Fix It

```php
// SAFE — Use environment variables in Laravel
// .env (never committed to git)
DB_PASSWORD=my_secret_password_123
STRIPE_KEY=sk_live_abc123xyz789

// config/database.php
'password' => env('DB_PASSWORD'),

// Make sure .env is in .gitignore!
```

```javascript
// SAFE — Use environment variables in Node.js
import dotenv from 'dotenv';
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_KEY);
const JWT_SECRET = process.env.JWT_SECRET;
```

### Best Practices

- Add `.env` to `.gitignore` before your first commit
- Use `.env.example` with placeholder values for documentation
- Rotate secrets immediately if they were ever committed
- Use secret management tools (Vault, AWS Secrets Manager) in production
- Run tools like `trufflehog` or `gitleaks` to scan for leaked secrets

---

