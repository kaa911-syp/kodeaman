# Input Validation / Validasi Input

## English

Input validation is the first line of defense against many attacks. Every piece of data from users, APIs, or external systems should be validated before use. Without it, attackers can inject malicious payloads.

### The Golden Rule

Never trust any input. Validate on the server side, even if you validate on the client side too.

### Vulnerable Code

```php
// VULNERABLE — Using user input directly
$id = $request->input('id');
$user = DB::select("SELECT * FROM users WHERE id = $id");

// VULNERABLE — No validation on redirect URL
return redirect($request->input('redirect_url'));
```

```javascript
// VULNERABLE — Using eval with user input
app.post('/calc', (req, res) => {
  const result = eval(req.body.expression);  // RCE!
  res.json({ result });
});

// VULNERABLE — No type checking
const age = req.body.age;  // Could be anything
db.query('UPDATE users SET age = $1', [age]);
```

### How to Fix It

```php
// SAFE — Laravel validation rules
$validated = $request->validate([
    'name' => 'required|string|max:255',
    'email' => 'required|email|max:255',
    'age' => 'required|integer|min:0|max:150',
    'url' => 'required|url|starts_with:https',
    'role' => 'required|in:user,editor,admin',
]);

// SAFE — Whitelist redirect URLs
$allowed = ['/dashboard', '/profile', '/settings'];
$redirect = in_array($request->input('redirect_url'), $allowed)
    ? $request->input('redirect_url')
    : '/dashboard';
```

```javascript
// SAFE — Use a validation library like Zod
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
  role: z.enum(['user', 'editor', 'admin']),
});

app.post('/user', (req, res) => {
  const result = UserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }
  createUser(result.data);
});
```

### Key Takeaways

- Validate all input server-side with strict type checks
- Use allowlists over denylists — define what is allowed, not what is blocked
- Validate data type, length, format, and range
- Use your framework's built-in validation (Laravel Validator, Zod)
- Sanitize output separately — validation and output encoding serve different purposes

---

