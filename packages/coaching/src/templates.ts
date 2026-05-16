export interface CoachingTemplate {
  key: string;
  category: string;
  ruleId?: string;
  titleEn: string;
  titleId: string;
  summaryEn: string;
  summaryId: string;
  whyItMattersEn: string;
  whyItMattersId: string;
  remediationEn: string[];
  remediationId: string[];
  safeExampleTitle?: string;
  safeExampleCode?: string;
  lessonId?: string;
  autofixEligible: boolean;
  autofixStrategy: "template-rewrite" | "llm-draft" | "none";
}

export const coachingTemplates: CoachingTemplate[] = [
  // 1. SQL Injection — raw queries
  {
    key: "sqli",
    category: "sqli",
    titleEn: "SQL Injection Detected",
    titleId: "SQL Injection Terdeteksi",
    summaryEn: "User input is being directly concatenated into a SQL query, allowing attackers to manipulate database operations.",
    summaryId: "Input pengguna langsung digabungkan ke dalam query SQL, memungkinkan penyerang memanipulasi operasi database.",
    whyItMattersEn: "SQL injection is one of the most dangerous vulnerabilities. Attackers can read all data, modify or delete records, and in some cases execute system commands through the database.",
    whyItMattersId: "SQL injection adalah salah satu kerentanan paling berbahaya. Penyerang bisa membaca semua data, mengubah atau menghapus record, dan dalam beberapa kasus mengeksekusi perintah sistem melalui database.",
    remediationEn: [
      "Use parameterized queries or prepared statements",
      "Use your ORM's query builder instead of raw SQL",
      "Apply input validation as an additional defense layer",
      "Use database accounts with minimum required privileges",
    ],
    remediationId: [
      "Gunakan parameterized query atau prepared statement",
      "Gunakan query builder dari ORM, bukan raw SQL",
      "Terapkan validasi input sebagai lapisan pertahanan tambahan",
      "Gunakan akun database dengan privilege minimum yang dibutuhkan",
    ],
    safeExampleTitle: "Parameterized query",
    safeExampleCode: "const users = await db.query('SELECT * FROM users WHERE id = $1', [userId]);",
    lessonId: "sqli-001",
    autofixEligible: true,
    autofixStrategy: "llm-draft",
  },

  // 2. SQL Injection — Laravel-specific
  {
    key: "sqli-laravel",
    category: "sqli",
    ruleId: "php.laravel.security.raw-sql-injection",
    titleEn: "Laravel Raw Query SQL Injection",
    titleId: "SQL Injection pada Raw Query Laravel",
    summaryEn: "Using DB::raw() or raw expressions with unsanitized user input in Laravel creates SQL injection risks.",
    summaryId: "Menggunakan DB::raw() atau ekspresi raw dengan input pengguna yang belum disanitasi di Laravel menciptakan risiko SQL injection.",
    whyItMattersEn: "Laravel provides Eloquent and query builder with automatic parameter binding. Using raw queries bypasses these protections and exposes your app to SQL injection.",
    whyItMattersId: "Laravel menyediakan Eloquent dan query builder dengan parameter binding otomatis. Menggunakan raw query melewati proteksi ini dan mengekspos aplikasi ke SQL injection.",
    remediationEn: [
      "Replace DB::raw() with Eloquent methods or query builder",
      "If raw queries are needed, use parameter bindings: DB::select('...', [$param])",
      "Never use $request->input() directly in DB::raw()",
      "Use whereRaw() with bindings instead of string concatenation",
    ],
    remediationId: [
      "Ganti DB::raw() dengan method Eloquent atau query builder",
      "Jika raw query dibutuhkan, gunakan parameter binding: DB::select('...', [$param])",
      "Jangan pernah gunakan $request->input() langsung di DB::raw()",
      "Gunakan whereRaw() dengan binding, bukan penggabungan string",
    ],
    safeExampleTitle: "Laravel Eloquent",
    safeExampleCode: "$users = User::where('email', $request->email)->get();",
    lessonId: "sqli-001",
    autofixEligible: true,
    autofixStrategy: "llm-draft",
  },

  // 3. XSS — Cross-site scripting
  {
    key: "xss",
    category: "xss",
    titleEn: "Cross-Site Scripting (XSS) Detected",
    titleId: "Cross-Site Scripting (XSS) Terdeteksi",
    summaryEn: "User-controlled data is rendered in HTML output without proper escaping, allowing script injection.",
    summaryId: "Data yang dikontrol pengguna ditampilkan di output HTML tanpa escaping yang benar, memungkinkan penyisipan skrip.",
    whyItMattersEn: "XSS allows attackers to execute JavaScript in victims' browsers, stealing session cookies, redirecting to phishing pages, or performing actions as the victim.",
    whyItMattersId: "XSS memungkinkan penyerang mengeksekusi JavaScript di browser korban, mencuri cookie sesi, mengarahkan ke halaman phishing, atau melakukan aksi sebagai korban.",
    remediationEn: [
      "Always escape output — use {{ }} in Blade, not {!! !!}",
      "Use Content-Security-Policy headers",
      "Sanitize HTML input with a library like DOMPurify",
      "Encode data based on context (HTML, JavaScript, URL, CSS)",
    ],
    remediationId: [
      "Selalu escape output — gunakan {{ }} di Blade, bukan {!! !!}",
      "Gunakan header Content-Security-Policy",
      "Sanitasi input HTML dengan library seperti DOMPurify",
      "Encode data sesuai konteks (HTML, JavaScript, URL, CSS)",
    ],
    lessonId: "xss-001",
    autofixEligible: true,
    autofixStrategy: "template-rewrite",
  },

  // 4. XSS — Reflected
  {
    key: "xss-reflected",
    category: "xss",
    titleEn: "Reflected XSS Detected",
    titleId: "Reflected XSS Terdeteksi",
    summaryEn: "Request parameters are reflected in the response without encoding. An attacker can craft a URL that executes scripts when clicked.",
    summaryId: "Parameter request direfleksikan di response tanpa encoding. Penyerang bisa membuat URL yang mengeksekusi skrip saat diklik.",
    whyItMattersEn: "Reflected XSS is commonly exploited via phishing links. A victim clicks a crafted URL and the injected script runs with their session privileges.",
    whyItMattersId: "Reflected XSS umumnya dieksploitasi lewat link phishing. Korban mengklik URL yang sudah direkayasa dan skrip yang disisipkan berjalan dengan privilege sesi mereka.",
    remediationEn: [
      "HTML-encode all request parameters before rendering",
      "Use template engines with auto-escaping enabled",
      "Add Content-Security-Policy headers to block inline scripts",
      "Validate and sanitize query parameters server-side",
    ],
    remediationId: [
      "HTML-encode semua parameter request sebelum ditampilkan",
      "Gunakan template engine dengan auto-escaping aktif",
      "Tambahkan header Content-Security-Policy untuk memblokir inline script",
      "Validasi dan sanitasi parameter query di sisi server",
    ],
    lessonId: "xss-001",
    autofixEligible: true,
    autofixStrategy: "template-rewrite",
  },

  // 5. CSRF — Missing CSRF protection
  {
    key: "csrf",
    category: "csrf",
    titleEn: "Missing CSRF Protection",
    titleId: "Proteksi CSRF Tidak Ada",
    summaryEn: "This state-changing endpoint lacks CSRF token verification, making it vulnerable to cross-site request forgery.",
    summaryId: "Endpoint yang mengubah state ini tidak memiliki verifikasi token CSRF, membuatnya rentan terhadap cross-site request forgery.",
    whyItMattersEn: "Without CSRF protection, an attacker can trick authenticated users into performing unwanted actions like changing passwords, transferring funds, or modifying data.",
    whyItMattersId: "Tanpa proteksi CSRF, penyerang bisa mengelabui pengguna yang sudah login untuk melakukan aksi yang tidak diinginkan seperti mengubah password, transfer dana, atau mengubah data.",
    remediationEn: [
      "Add @csrf directive to all forms in Laravel Blade",
      "Do not disable the VerifyCsrfToken middleware",
      "Use CSRF tokens for all POST/PUT/DELETE routes",
      "For APIs, use token-based authentication (JWT/Bearer) instead",
    ],
    remediationId: [
      "Tambahkan directive @csrf ke semua form di Laravel Blade",
      "Jangan nonaktifkan middleware VerifyCsrfToken",
      "Gunakan token CSRF untuk semua route POST/PUT/DELETE",
      "Untuk API, gunakan autentikasi berbasis token (JWT/Bearer)",
    ],
    lessonId: "csrf-001",
    autofixEligible: true,
    autofixStrategy: "template-rewrite",
  },

  // 6. Authentication bypass
  {
    key: "auth-bypass",
    category: "auth",
    titleEn: "Authentication Bypass Risk",
    titleId: "Risiko Bypass Autentikasi",
    summaryEn: "The authentication logic contains a flaw that may allow unauthorized access without valid credentials.",
    summaryId: "Logika autentikasi mengandung kelemahan yang bisa memungkinkan akses tanpa kredensial yang valid.",
    whyItMattersEn: "Authentication bypass gives attackers full access to user accounts and protected resources without needing passwords or tokens.",
    whyItMattersId: "Bypass autentikasi memberi penyerang akses penuh ke akun pengguna dan resource yang dilindungi tanpa memerlukan password atau token.",
    remediationEn: [
      "Use your framework's built-in auth system (Laravel Guard, Passport)",
      "Never implement custom authentication logic unless absolutely necessary",
      "Ensure all protected routes have authentication middleware",
      "Test edge cases: empty passwords, null tokens, expired sessions",
    ],
    remediationId: [
      "Gunakan sistem auth bawaan framework (Laravel Guard, Passport)",
      "Jangan implementasi logika autentikasi sendiri kecuali benar-benar diperlukan",
      "Pastikan semua route yang dilindungi memiliki middleware autentikasi",
      "Tes edge case: password kosong, token null, sesi kedaluwarsa",
    ],
    lessonId: "auth-001",
    autofixEligible: false,
    autofixStrategy: "none",
  },

  // 7. Hardcoded secret
  {
    key: "hardcoded-secret",
    category: "secrets",
    titleEn: "Hardcoded Secret Detected",
    titleId: "Secret yang Di-hardcode Terdeteksi",
    summaryEn: "A credential, API key, or password is hardcoded in the source code instead of being stored securely.",
    summaryId: "Kredensial, API key, atau password di-hardcode di source code, bukan disimpan secara aman.",
    whyItMattersEn: "Hardcoded secrets in source code are visible to anyone with repository access. Once committed, they persist in git history even after removal and can be found by automated scanning tools.",
    whyItMattersId: "Secret yang di-hardcode di source code terlihat oleh siapa saja yang punya akses repository. Setelah di-commit, mereka tetap ada di history git meskipun sudah dihapus dan bisa ditemukan oleh tool scanning otomatis.",
    remediationEn: [
      "Move the secret to an environment variable",
      "Add .env to .gitignore",
      "Rotate the exposed secret immediately",
      "Use a secret management service for production",
    ],
    remediationId: [
      "Pindahkan secret ke environment variable",
      "Tambahkan .env ke .gitignore",
      "Rotasi secret yang terekspos segera",
      "Gunakan layanan manajemen secret untuk produksi",
    ],
    safeExampleTitle: "Environment variable",
    safeExampleCode: "const apiKey = process.env.API_KEY;",
    lessonId: "secrets-001",
    autofixEligible: true,
    autofixStrategy: "llm-draft",
  },

  // 8. .env exposure
  {
    key: "env-exposure",
    category: "config",
    titleEn: ".env File Exposure Risk",
    titleId: "Risiko Eksposur File .env",
    summaryEn: "The .env file may be accessible publicly or is committed to version control, exposing sensitive configuration.",
    summaryId: "File .env mungkin bisa diakses secara publik atau di-commit ke version control, mengekspos konfigurasi sensitif.",
    whyItMattersEn: ".env files contain database credentials, API keys, and app secrets. Public exposure gives attackers everything they need to compromise your application and infrastructure.",
    whyItMattersId: "File .env berisi kredensial database, API key, dan secret aplikasi. Eksposur publik memberi penyerang semua yang mereka butuhkan untuk mengkompromikan aplikasi dan infrastruktur.",
    remediationEn: [
      "Ensure .env is in .gitignore",
      "Block .env access in your web server config",
      "Use .env.example with placeholder values for documentation",
      "If .env was committed, rotate all contained secrets",
    ],
    remediationId: [
      "Pastikan .env ada di .gitignore",
      "Blokir akses .env di konfigurasi web server",
      "Gunakan .env.example dengan nilai placeholder untuk dokumentasi",
      "Jika .env pernah di-commit, rotasi semua secret di dalamnya",
    ],
    lessonId: "secrets-001",
    autofixEligible: true,
    autofixStrategy: "template-rewrite",
  },

  // 9. Debug mode in production
  {
    key: "debug-mode",
    category: "misconfiguration",
    titleEn: "Debug Mode Enabled in Production",
    titleId: "Mode Debug Aktif di Produksi",
    summaryEn: "The application is running with debug mode enabled, exposing detailed error messages, stack traces, and internal paths.",
    summaryId: "Aplikasi berjalan dengan mode debug aktif, mengekspos pesan error detail, stack trace, dan path internal.",
    whyItMattersEn: "Debug mode reveals your application's internals: file paths, database structure, framework version, and configuration. Attackers use this information to plan targeted attacks.",
    whyItMattersId: "Mode debug mengungkap internal aplikasi: path file, struktur database, versi framework, dan konfigurasi. Penyerang menggunakan informasi ini untuk merencanakan serangan yang ditargetkan.",
    remediationEn: [
      "Set APP_DEBUG=false in production .env",
      "Set APP_ENV=production",
      "Use generic error pages for users",
      "Log detailed errors server-side only",
    ],
    remediationId: [
      "Set APP_DEBUG=false di .env produksi",
      "Set APP_ENV=production",
      "Gunakan halaman error generik untuk pengguna",
      "Log error detail hanya di sisi server",
    ],
    lessonId: "config-001",
    autofixEligible: true,
    autofixStrategy: "template-rewrite",
  },

  // 10. Unsafe file upload
  {
    key: "file-upload",
    category: "file-upload",
    titleEn: "Unsafe File Upload",
    titleId: "Upload File Tidak Aman",
    summaryEn: "File uploads lack proper type validation, size limits, or safe naming, which can lead to remote code execution.",
    summaryId: "Upload file tidak memiliki validasi tipe, batas ukuran, atau penamaan yang aman, yang bisa menyebabkan eksekusi kode jarak jauh.",
    whyItMattersEn: "An attacker can upload a PHP/JS webshell disguised as an image. If stored in a web-accessible directory and executed by the server, it gives full control over your system.",
    whyItMattersId: "Penyerang bisa mengupload webshell PHP/JS yang disamarkan sebagai gambar. Jika disimpan di direktori yang bisa diakses web dan dieksekusi oleh server, itu memberi kontrol penuh atas sistem.",
    remediationEn: [
      "Validate file MIME type server-side (not just extension)",
      "Generate random filenames, never use the original name",
      "Limit file size to prevent DoS",
      "Store uploads outside the web root",
      "Scan uploads for malware when possible",
    ],
    remediationId: [
      "Validasi MIME type file di sisi server (bukan hanya ekstensi)",
      "Buat nama file acak, jangan pernah pakai nama asli",
      "Batasi ukuran file untuk mencegah DoS",
      "Simpan upload di luar web root",
      "Scan upload untuk malware jika memungkinkan",
    ],
    lessonId: "upload-001",
    autofixEligible: false,
    autofixStrategy: "none",
  },

  // 11. Mass assignment
  {
    key: "mass-assignment",
    category: "input-validation",
    ruleId: "php.laravel.security.mass-assignment",
    titleEn: "Mass Assignment Vulnerability",
    titleId: "Kerentanan Mass Assignment",
    summaryEn: "Model properties are being filled from user input without restricting which fields can be set, allowing attackers to modify protected fields.",
    summaryId: "Properti model diisi dari input pengguna tanpa membatasi field mana yang boleh di-set, memungkinkan penyerang mengubah field yang dilindungi.",
    whyItMattersEn: "An attacker can add extra fields to a request (like is_admin=true or role=admin) and escalate their privileges if the model doesn't restrict fillable fields.",
    whyItMattersId: "Penyerang bisa menambahkan field tambahan ke request (seperti is_admin=true atau role=admin) dan menaikkan privilege mereka jika model tidak membatasi field yang fillable.",
    remediationEn: [
      "Define $fillable on all Eloquent models with only the allowed fields",
      "Or use $guarded to block sensitive fields like 'is_admin', 'role'",
      "Never use Model::create($request->all())",
      "Use $request->only(['name', 'email']) to whitelist input fields",
    ],
    remediationId: [
      "Definisikan $fillable di semua model Eloquent dengan field yang diizinkan saja",
      "Atau gunakan $guarded untuk memblokir field sensitif seperti 'is_admin', 'role'",
      "Jangan pernah gunakan Model::create($request->all())",
      "Gunakan $request->only(['name', 'email']) untuk whitelist field input",
    ],
    safeExampleTitle: "Laravel $fillable",
    safeExampleCode: "protected $fillable = ['name', 'email', 'password'];",
    lessonId: "input-001",
    autofixEligible: true,
    autofixStrategy: "llm-draft",
  },

  // 12. Open redirect
  {
    key: "open-redirect",
    category: "input-validation",
    titleEn: "Open Redirect Detected",
    titleId: "Open Redirect Terdeteksi",
    summaryEn: "The application redirects to a URL controlled by user input without validation, enabling phishing attacks.",
    summaryId: "Aplikasi mengarahkan ke URL yang dikontrol oleh input pengguna tanpa validasi, memungkinkan serangan phishing.",
    whyItMattersEn: "Open redirects let attackers create legitimate-looking URLs from your domain that redirect victims to phishing sites, bypassing user trust and email filters.",
    whyItMattersId: "Open redirect memungkinkan penyerang membuat URL yang terlihat legitimate dari domain kamu yang mengarahkan korban ke situs phishing, melewati kepercayaan pengguna dan filter email.",
    remediationEn: [
      "Validate redirect URLs against an allowlist of domains",
      "Only allow relative path redirects (starting with /)",
      "Never pass full URLs from user input to redirect functions",
      "Use named routes instead of URL parameters for redirects",
    ],
    remediationId: [
      "Validasi URL redirect terhadap allowlist domain",
      "Hanya izinkan redirect path relatif (dimulai dengan /)",
      "Jangan pernah berikan full URL dari input pengguna ke fungsi redirect",
      "Gunakan named route, bukan parameter URL untuk redirect",
    ],
    autofixEligible: true,
    autofixStrategy: "llm-draft",
  },

  // 13. Path traversal
  {
    key: "path-traversal",
    category: "input-validation",
    titleEn: "Path Traversal / Local File Inclusion",
    titleId: "Path Traversal / Local File Inclusion",
    summaryEn: "User input is used to construct file paths without sanitization, allowing access to files outside the intended directory.",
    summaryId: "Input pengguna digunakan untuk membuat path file tanpa sanitasi, memungkinkan akses ke file di luar direktori yang dimaksud.",
    whyItMattersEn: "Path traversal can expose sensitive files like /etc/passwd, application source code, configuration files, and environment variables.",
    whyItMattersId: "Path traversal bisa mengekspos file sensitif seperti /etc/passwd, source code aplikasi, file konfigurasi, dan environment variable.",
    remediationEn: [
      "Never use user input directly in file paths",
      "Use basename() to strip directory components",
      "Validate paths against a whitelist of allowed files/directories",
      "Use realpath() and verify the result is within the expected directory",
    ],
    remediationId: [
      "Jangan pernah gunakan input pengguna langsung di path file",
      "Gunakan basename() untuk menghapus komponen direktori",
      "Validasi path terhadap whitelist file/direktori yang diizinkan",
      "Gunakan realpath() dan verifikasi hasilnya ada di dalam direktori yang diharapkan",
    ],
    autofixEligible: true,
    autofixStrategy: "llm-draft",
  },

  // 14. Insecure deserialization
  {
    key: "insecure-deserialization",
    category: "rce",
    titleEn: "Insecure Deserialization",
    titleId: "Deserialization Tidak Aman",
    summaryEn: "Untrusted data is being deserialized, which can lead to remote code execution if the data contains crafted objects.",
    summaryId: "Data yang tidak terpercaya sedang di-deserialize, yang bisa menyebabkan eksekusi kode jarak jauh jika data mengandung objek yang direkayasa.",
    whyItMattersEn: "Insecure deserialization is one of the most severe vulnerabilities. Attackers can craft serialized payloads that execute arbitrary code when deserialized by your application.",
    whyItMattersId: "Deserialization yang tidak aman adalah salah satu kerentanan paling parah. Penyerang bisa membuat payload terserialisasi yang mengeksekusi kode sembarang saat di-deserialize oleh aplikasi.",
    remediationEn: [
      "Never deserialize data from untrusted sources",
      "Use JSON instead of native serialization formats",
      "If deserialization is needed, validate and sanitize the data first",
      "Implement integrity checks (HMAC) on serialized data",
    ],
    remediationId: [
      "Jangan pernah deserialize data dari sumber yang tidak terpercaya",
      "Gunakan JSON daripada format serialisasi native",
      "Jika deserialization diperlukan, validasi dan sanitasi data terlebih dahulu",
      "Implementasikan pengecekan integritas (HMAC) pada data terserialisasi",
    ],
    autofixEligible: false,
    autofixStrategy: "none",
  },

  // 15. Weak cryptography
  {
    key: "weak-crypto",
    category: "sast",
    titleEn: "Weak Cryptographic Algorithm",
    titleId: "Algoritma Kriptografi Lemah",
    summaryEn: "The code uses a weak or deprecated cryptographic algorithm (MD5, SHA1, DES) that is vulnerable to attacks.",
    summaryId: "Kode menggunakan algoritma kriptografi yang lemah atau sudah deprecated (MD5, SHA1, DES) yang rentan terhadap serangan.",
    whyItMattersEn: "Weak hashing algorithms like MD5 can be cracked in seconds with rainbow tables. Weak encryption like DES provides no meaningful protection against modern attacks.",
    whyItMattersId: "Algoritma hashing lemah seperti MD5 bisa di-crack dalam hitungan detik dengan rainbow table. Enkripsi lemah seperti DES tidak memberikan proteksi yang berarti terhadap serangan modern.",
    remediationEn: [
      "For password hashing: use bcrypt or Argon2, not MD5/SHA",
      "For integrity checks: use SHA-256 or SHA-512",
      "For encryption: use AES-256-GCM",
      "For random values: use crypto.randomBytes() or random_bytes()",
    ],
    remediationId: [
      "Untuk hashing password: gunakan bcrypt atau Argon2, bukan MD5/SHA",
      "Untuk pengecekan integritas: gunakan SHA-256 atau SHA-512",
      "Untuk enkripsi: gunakan AES-256-GCM",
      "Untuk nilai random: gunakan crypto.randomBytes() atau random_bytes()",
    ],
    lessonId: "crypto-001",
    autofixEligible: true,
    autofixStrategy: "llm-draft",
  },

  // 16. Missing auth on route
  {
    key: "missing-auth",
    category: "auth",
    titleEn: "Missing Authentication on Route",
    titleId: "Autentikasi Tidak Ada pada Route",
    summaryEn: "A route that handles sensitive data or operations is missing authentication middleware.",
    summaryId: "Route yang menangani data atau operasi sensitif tidak memiliki middleware autentikasi.",
    whyItMattersEn: "Without authentication, anyone can access the endpoint — including bots, crawlers, and attackers. Sensitive operations must verify the caller's identity.",
    whyItMattersId: "Tanpa autentikasi, siapa saja bisa mengakses endpoint — termasuk bot, crawler, dan penyerang. Operasi sensitif harus memverifikasi identitas pemanggil.",
    remediationEn: [
      "Add authentication middleware to all sensitive routes",
      "Group routes under auth middleware in Laravel: Route::middleware('auth')",
      "In Express, add auth middleware: app.use('/api', authMiddleware)",
      "Audit all routes to ensure proper auth coverage",
    ],
    remediationId: [
      "Tambahkan middleware autentikasi ke semua route sensitif",
      "Kelompokkan route di bawah middleware auth di Laravel: Route::middleware('auth')",
      "Di Express, tambahkan middleware auth: app.use('/api', authMiddleware)",
      "Audit semua route untuk memastikan coverage auth yang benar",
    ],
    lessonId: "auth-001",
    autofixEligible: true,
    autofixStrategy: "template-rewrite",
  },

  // 17. CORS misconfiguration
  {
    key: "cors-misconfiguration",
    category: "misconfiguration",
    titleEn: "CORS Misconfiguration",
    titleId: "Miskonfigurasi CORS",
    summaryEn: "The CORS policy is overly permissive, potentially allowing unauthorized cross-origin requests to your API.",
    summaryId: "Kebijakan CORS terlalu permisif, berpotensi memungkinkan request cross-origin yang tidak sah ke API kamu.",
    whyItMattersEn: "Permissive CORS with credentials support lets malicious websites make authenticated requests to your API, potentially reading sensitive data or performing actions as the user.",
    whyItMattersId: "CORS permisif dengan dukungan credentials memungkinkan situs web berbahaya membuat request terautentikasi ke API kamu, berpotensi membaca data sensitif atau melakukan aksi sebagai pengguna.",
    remediationEn: [
      "Never use wildcard (*) with credentials: true",
      "Whitelist specific allowed origins",
      "Restrict allowed methods to only what your API needs",
      "Test CORS with: curl -H 'Origin: https://evil.com' your-api",
    ],
    remediationId: [
      "Jangan pernah gunakan wildcard (*) dengan credentials: true",
      "Whitelist origin spesifik yang diizinkan",
      "Batasi method yang diizinkan hanya yang dibutuhkan API",
      "Tes CORS dengan: curl -H 'Origin: https://evil.com' api-kamu",
    ],
    lessonId: "cors-001",
    autofixEligible: true,
    autofixStrategy: "llm-draft",
  },

  // 18. Weak JWT configuration
  {
    key: "jwt-weak",
    category: "auth",
    titleEn: "Weak JWT Configuration",
    titleId: "Konfigurasi JWT Lemah",
    summaryEn: "JWT token is using an insecure algorithm, hardcoded secret, or missing expiration, creating authentication bypass risks.",
    summaryId: "Token JWT menggunakan algoritma tidak aman, secret yang di-hardcode, atau tanpa masa kedaluwarsa, menciptakan risiko bypass autentikasi.",
    whyItMattersEn: "Weak JWT configuration can let attackers forge valid tokens. The 'none' algorithm, weak secrets, and missing expiry are commonly exploited to gain unauthorized access.",
    whyItMattersId: "Konfigurasi JWT yang lemah bisa memungkinkan penyerang memalsukan token yang valid. Algoritma 'none', secret lemah, dan tanpa kedaluwarsa umumnya dieksploitasi untuk mendapat akses tidak sah.",
    remediationEn: [
      "Use strong algorithms (HS256, RS256), never 'none'",
      "Store JWT secret in environment variables, minimum 32 characters",
      "Always set an expiration time (expiresIn)",
      "Validate the algorithm server-side to prevent algorithm switching",
    ],
    remediationId: [
      "Gunakan algoritma kuat (HS256, RS256), jangan pernah 'none'",
      "Simpan secret JWT di environment variable, minimum 32 karakter",
      "Selalu set waktu kedaluwarsa (expiresIn)",
      "Validasi algoritma di sisi server untuk mencegah switching algoritma",
    ],
    lessonId: "auth-001",
    autofixEligible: true,
    autofixStrategy: "llm-draft",
  },

  // 19. Eval injection
  {
    key: "eval-injection",
    category: "rce",
    titleEn: "Dangerous eval() / exec() Usage",
    titleId: "Penggunaan eval() / exec() Berbahaya",
    summaryEn: "User-controlled input reaches eval(), exec(), Function(), or child_process, allowing arbitrary code execution.",
    summaryId: "Input yang dikontrol pengguna mencapai eval(), exec(), Function(), atau child_process, memungkinkan eksekusi kode sembarang.",
    whyItMattersEn: "eval() with user input is essentially giving attackers a terminal on your server. They can read files, access databases, install backdoors, and pivot to other systems.",
    whyItMattersId: "eval() dengan input pengguna pada dasarnya memberi penyerang terminal di server kamu. Mereka bisa membaca file, mengakses database, memasang backdoor, dan berpindah ke sistem lain.",
    remediationEn: [
      "Remove eval()/exec() calls entirely — there is almost always a safer alternative",
      "For mathematical expressions, use a safe parser library",
      "For dynamic code needs, use sandboxed environments (vm2, isolated-vm)",
      "If child_process is needed, use execFile() with explicit args, never shell interpolation",
    ],
    remediationId: [
      "Hapus panggilan eval()/exec() sepenuhnya — hampir selalu ada alternatif yang lebih aman",
      "Untuk ekspresi matematis, gunakan library parser yang aman",
      "Untuk kebutuhan kode dinamis, gunakan environment yang di-sandbox (vm2, isolated-vm)",
      "Jika child_process diperlukan, gunakan execFile() dengan args eksplisit, jangan interpolasi shell",
    ],
    autofixEligible: true,
    autofixStrategy: "llm-draft",
  },

  // 20. Insecure Design (OWASP A04)
  {
    key: "insecure-design",
    category: "auth",
    titleEn: "Insecure Design Pattern",
    titleId: "Pola Desain Tidak Aman",
    summaryEn: "The application lacks fundamental security controls such as rate limiting, authorization checks, or business logic validation that should be designed into the architecture.",
    summaryId: "Aplikasi tidak memiliki kontrol keamanan fundamental seperti rate limiting, pengecekan otorisasi, atau validasi logika bisnis yang seharusnya dirancang ke dalam arsitektur.",
    whyItMattersEn: "Insecure design flaws cannot be fixed by a perfect implementation — they require architectural changes. Missing threat modeling during design leads to fundamental vulnerabilities that are expensive to fix later.",
    whyItMattersId: "Kelemahan desain yang tidak aman tidak bisa diperbaiki dengan implementasi yang sempurna — memerlukan perubahan arsitektur. Tidak adanya threat modeling saat desain menyebabkan kerentanan fundamental yang mahal untuk diperbaiki nanti.",
    remediationEn: [
      "Apply threat modeling (STRIDE/DREAD) during the design phase",
      "Implement defense in depth — multiple security layers",
      "Add rate limiting to all sensitive endpoints",
      "Design authorization checks into the data access layer",
    ],
    remediationId: [
      "Terapkan threat modeling (STRIDE/DREAD) pada fase desain",
      "Implementasikan pertahanan berlapis — beberapa lapisan keamanan",
      "Tambahkan rate limiting ke semua endpoint sensitif",
      "Rancang pengecekan otorisasi ke dalam lapisan akses data",
    ],
    lessonId: "insecure-design-001",
    autofixEligible: false,
    autofixStrategy: "none",
  },

  // 21. Vulnerable Components (OWASP A06)
  {
    key: "vulnerable-component",
    category: "sca",
    titleEn: "Vulnerable Dependency Detected",
    titleId: "Dependensi Rentan Terdeteksi",
    summaryEn: "A dependency in your project has a known security vulnerability. Attackers can exploit well-documented CVEs in outdated packages to compromise your application.",
    summaryId: "Sebuah dependensi dalam proyek Anda memiliki kerentanan keamanan yang diketahui. Penyerang dapat mengeksploitasi CVE yang terdokumentasi dengan baik pada paket yang usang untuk mengkompromikan aplikasi Anda.",
    whyItMattersEn: "Vulnerable dependencies are one of the easiest attack vectors. Exploits for known CVEs are often publicly available and automated, making unpatched applications easy targets.",
    whyItMattersId: "Dependensi yang rentan adalah salah satu vektor serangan termudah. Eksploitasi untuk CVE yang diketahui sering tersedia secara publik dan diotomasi, menjadikan aplikasi yang tidak di-patch target mudah.",
    remediationEn: [
      "Run npm audit / pnpm audit regularly and in CI/CD",
      "Update vulnerable packages to patched versions",
      "Enable Dependabot or Renovate for automatic updates",
      "Remove unused dependencies to reduce attack surface",
    ],
    remediationId: [
      "Jalankan npm audit / pnpm audit secara rutin dan di CI/CD",
      "Perbarui paket yang rentan ke versi yang telah dipatch",
      "Aktifkan Dependabot atau Renovate untuk pembaruan otomatis",
      "Hapus dependensi yang tidak digunakan untuk mengurangi permukaan serangan",
    ],
    lessonId: "sca-001",
    autofixEligible: true,
    autofixStrategy: "llm-draft",
  },

  // 22. Data Integrity Failures (OWASP A08)
  {
    key: "data-integrity",
    category: "config",
    titleEn: "Software/Data Integrity Failure",
    titleId: "Kegagalan Integritas Perangkat Lunak/Data",
    summaryEn: "The application does not verify the integrity of software updates, external scripts, or CI/CD pipeline artifacts, allowing potential supply chain attacks.",
    summaryId: "Aplikasi tidak memverifikasi integritas pembaruan perangkat lunak, skrip eksternal, atau artefak pipeline CI/CD, memungkinkan potensi serangan supply chain.",
    whyItMattersEn: "Without integrity verification, attackers can inject malicious code through compromised CDN scripts, tampered packages, or manipulated CI/CD pipelines. Supply chain attacks affect all downstream users.",
    whyItMattersId: "Tanpa verifikasi integritas, penyerang dapat menyuntikkan kode berbahaya melalui skrip CDN yang dikompromikan, paket yang dirusak, atau pipeline CI/CD yang dimanipulasi. Serangan supply chain memengaruhi semua pengguna hilir.",
    remediationEn: [
      "Use Subresource Integrity (SRI) for all external scripts",
      "Pin CI/CD actions to specific commit SHAs",
      "Verify checksums/signatures for downloaded artifacts",
      "Use npm ci instead of npm install in CI pipelines",
    ],
    remediationId: [
      "Gunakan Subresource Integrity (SRI) untuk semua skrip eksternal",
      "Pin CI/CD action ke SHA commit spesifik",
      "Verifikasi checksum/signature untuk artefak yang diunduh",
      "Gunakan npm ci daripada npm install di pipeline CI",
    ],
    lessonId: "data-integrity-001",
    autofixEligible: true,
    autofixStrategy: "llm-draft",
  },

  // 23. Logging & Monitoring Failures (OWASP A09)
  {
    key: "logging-monitoring",
    category: "config",
    titleEn: "Insufficient Security Logging & Monitoring",
    titleId: "Pencatatan & Pemantauan Keamanan Tidak Memadai",
    summaryEn: "The application lacks adequate security event logging or monitoring, allowing attackers to go undetected and persist in compromised systems.",
    summaryId: "Aplikasi tidak memiliki pencatatan atau pemantauan event keamanan yang memadai, memungkinkan penyerang tidak terdeteksi dan bertahan di sistem yang dikompromikan.",
    whyItMattersEn: "Without logging and monitoring, breaches can go undetected for months. The average time to detect a breach is 207 days — proper logging and alerting dramatically reduces this window.",
    whyItMattersId: "Tanpa logging dan monitoring, pelanggaran bisa tidak terdeteksi selama berbulan-bulan. Waktu rata-rata untuk mendeteksi pelanggaran adalah 207 hari — logging dan alerting yang tepat secara dramatis mengurangi jendela ini.",
    remediationEn: [
      "Log all authentication and authorization events",
      "Never log passwords, tokens, or PII",
      "Set up alerts for brute force, privilege escalation, unusual data access",
      "Retain security logs for at least 90 days",
    ],
    remediationId: [
      "Log semua event autentikasi dan otorisasi",
      "Jangan pernah log password, token, atau PII",
      "Atur alert untuk brute force, eskalasi privilege, akses data tidak biasa",
      "Simpan log keamanan minimal 90 hari",
    ],
    lessonId: "logging-001",
    autofixEligible: false,
    autofixStrategy: "none",
  },

  // 24. Information leak
  {
    key: "info-leak",
    category: "info-leak",
    titleEn: "Information Disclosure via Error Messages",
    titleId: "Kebocoran Informasi via Pesan Error",
    summaryEn: "Detailed error messages, stack traces, or internal paths are exposed to end users, revealing application internals.",
    summaryId: "Pesan error detail, stack trace, atau path internal diekspos ke pengguna akhir, mengungkap internal aplikasi.",
    whyItMattersEn: "Error messages can reveal framework version, file paths, database structure, and third-party services. Attackers use this for reconnaissance to plan more targeted attacks.",
    whyItMattersId: "Pesan error bisa mengungkap versi framework, path file, struktur database, dan layanan pihak ketiga. Penyerang menggunakan ini untuk reconnaissance guna merencanakan serangan yang lebih terarah.",
    remediationEn: [
      "Return generic error messages to users (500: Internal Server Error)",
      "Log detailed errors server-side with proper log management",
      "Disable debug mode and verbose error reporting in production",
      "Remove server version headers (X-Powered-By, Server)",
    ],
    remediationId: [
      "Kembalikan pesan error generik ke pengguna (500: Internal Server Error)",
      "Log error detail di sisi server dengan log management yang benar",
      "Nonaktifkan mode debug dan pelaporan error verbose di produksi",
      "Hapus header versi server (X-Powered-By, Server)",
    ],
    lessonId: "config-001",
    autofixEligible: true,
    autofixStrategy: "template-rewrite",
  },
];

const templateByKey = new Map<string, CoachingTemplate>();
const templateByCategory = new Map<string, CoachingTemplate[]>();
const templateByRuleId = new Map<string, CoachingTemplate>();

for (const t of coachingTemplates) {
  templateByKey.set(t.key, t);
  if (t.ruleId) {
    templateByRuleId.set(t.ruleId, t);
  }
  const existing = templateByCategory.get(t.category) ?? [];
  existing.push(t);
  templateByCategory.set(t.category, existing);
}

export function getTemplateByKey(key: string): CoachingTemplate | undefined {
  return templateByKey.get(key);
}

export function getTemplateByRuleId(ruleId: string): CoachingTemplate | undefined {
  return templateByRuleId.get(ruleId);
}

export function getTemplatesByCategory(category: string): CoachingTemplate[] {
  return templateByCategory.get(category) ?? [];
}
