// Demo: Intentionally vulnerable Express server for KodeAman testing
// DO NOT deploy this code — it contains deliberate security issues

const express = require("express");
const app = express();

// A05: Hardcoded secret (Security Misconfiguration)
const SECRET_KEY = "super-secret-key-12345";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// A03: SQL Injection — unsanitized user input in query
app.get("/users", (req, res) => {
  const name = req.query.name;
  // Vulnerable: string concatenation in query
  const query = `SELECT * FROM users WHERE name = '${name}'`;
  res.json({ query, message: "This query is vulnerable to SQL injection" });
});

// A07: Hardcoded credentials in source
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    res.json({ token: SECRET_KEY });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// A01: Broken Access Control — no authorization check
app.get("/admin/users", (req, res) => {
  res.json({ users: ["alice", "bob", "charlie"] });
});

// A03: XSS — reflected user input
app.get("/search", (req, res) => {
  const q = req.query.q;
  res.send(`<html><body>Results for: ${q}</body></html>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Demo server running on port ${PORT}`);
});
