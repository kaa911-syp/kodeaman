# SQL Injection Basics / Dasar-Dasar SQL Injection

## English

SQL Injection (SQLi) happens when user input is inserted directly into a database query without proper sanitization. This lets attackers manipulate your queries to read, modify, or delete data.

### How It Works

When you build queries by concatenating strings with user input, an attacker can inject SQL commands:

```php
// VULNERABLE — Laravel raw query with string concatenation
$users = DB::select("SELECT * FROM users WHERE email = '" . $request->email . "'");
// Attacker sends: ' OR 1=1 --
// Resulting query: SELECT * FROM users WHERE email = '' OR 1=1 --'
```

```javascript
// VULNERABLE — Node.js with string concatenation
const query = `SELECT * FROM users WHERE email = '${req.body.email}'`;
db.query(query);
```

### How to Fix It

Always use parameterized queries or your framework's query builder:

```php
// SAFE — Laravel Eloquent
$users = User::where('email', $request->email)->get();

// SAFE — Laravel query builder with bindings
$users = DB::select("SELECT * FROM users WHERE email = ?", [$request->email]);
```

```javascript
// SAFE — Node.js with parameterized query
const query = 'SELECT * FROM users WHERE email = $1';
db.query(query, [req.body.email]);

// SAFE — Using an ORM like Knex
const users = await knex('users').where('email', req.body.email);
```

### Key Takeaways

- Never concatenate user input into SQL queries
- Use parameterized queries or ORM methods
- Apply the principle of least privilege to database accounts
- Validate and sanitize input as an extra layer of defense

---

