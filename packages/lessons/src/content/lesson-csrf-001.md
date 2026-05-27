# CSRF Protection / Perlindungan CSRF

## English

Cross-Site Request Forgery (CSRF) tricks a logged-in user's browser into making unwanted requests. If a user is authenticated on your site, an attacker can craft a page that submits a form to your application on behalf of that user.

### How It Works

An attacker hosts a page with a hidden form that auto-submits:

```html
<!-- On attacker's site -->
<form action="https://yourapp.com/transfer" method="POST">
  <input type="hidden" name="amount" value="10000" />
  <input type="hidden" name="to" value="attacker-account" />
</form>
<script>document.forms[0].submit();</script>
```

### Vulnerable Code

```php
// VULNERABLE — Laravel route without CSRF middleware
Route::post('/transfer', [TransferController::class, 'store'])
    ->withoutMiddleware(['csrf']);
```

```javascript
// VULNERABLE — Express without CSRF protection
app.post('/transfer', (req, res) => {
  transferFunds(req.body.to, req.body.amount);
  res.json({ ok: true });
});
```

### How to Fix It

```php
// SAFE — Laravel includes CSRF by default in web routes
// Just include @csrf in your Blade forms
<form method="POST" action="/transfer">
    @csrf
    <input name="amount" />
    <button type="submit">Transfer</button>
</form>
```

```javascript
// SAFE — Express with csurf middleware
import csrf from 'csurf';
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});
app.post('/transfer', csrfProtection, (req, res) => {
  transferFunds(req.body.to, req.body.amount);
});
```

### Key Takeaways

- Always use CSRF tokens for state-changing operations
- Laravel includes CSRF protection by default — don't disable it
- For APIs, use SameSite cookies or token-based auth (JWT)
- Verify the Origin/Referer header as an additional check

---

