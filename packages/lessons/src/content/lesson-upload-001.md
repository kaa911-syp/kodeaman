# Safe File Uploads / Upload File yang Aman

## English

File upload vulnerabilities can lead to remote code execution, server compromise, or denial of service. Attackers may upload malicious files disguised as legitimate ones.

### Common Mistakes

```php
// VULNERABLE — No file type validation in Laravel
public function store(Request $request) {
    $request->file('avatar')->store('uploads');  // Any file type accepted
}

// VULNERABLE — Trusting client-side MIME type
$mime = $request->file('doc')->getClientMimeType();  // Can be spoofed
```

```javascript
// VULNERABLE — No restrictions on uploads
app.post('/upload', upload.single('file'), (req, res) => {
  fs.renameSync(req.file.path, `uploads/${req.file.originalname}`);
  // Original filename could contain path traversal: ../../etc/passwd
});
```

### How to Fix It

```php
// SAFE — Validate file type, size, and generate safe name
$request->validate([
    'avatar' => 'required|file|mimes:jpg,png,gif|max:2048',
]);
$path = $request->file('avatar')->store('avatars', 'public');

// SAFE — Check actual MIME type, not client-reported
$mime = $request->file('avatar')->getMimeType();  // Server-side detection
$allowed = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($mime, $allowed)) { abort(422); }
```

```javascript
// SAFE — Validate with multer and file-type
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import { randomUUID } from 'crypto';

const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    cb(null, allowed.includes(file.mimetype));
  },
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const type = await fileTypeFromBuffer(req.file.buffer);
  if (!type || !['jpg', 'png', 'gif'].includes(type.ext)) {
    return res.status(422).json({ error: 'Invalid file type' });
  }
  const safeName = `${randomUUID()}.${type.ext}`;
  // Save with safe generated name, never use originalname
});
```

### Key Takeaways

- Always validate file type server-side, not just client-side
- Generate random filenames — never use the original filename
- Limit file size to prevent denial of service
- Store uploads outside the web root or use a CDN
- Scan uploaded files for malware if possible

---

## Bahasa Indonesia

Kerentanan upload file bisa menyebabkan eksekusi kode jarak jauh, kompromi server, atau denial of service. Penyerang bisa mengupload file berbahaya yang disamarkan sebagai file yang sah.

### Kesalahan Umum

```php
// RENTAN — Tidak ada validasi tipe file di Laravel
public function store(Request $request) {
    $request->file('avatar')->store('uploads');  // Tipe file apa saja diterima
}

// RENTAN — Mempercayai MIME type dari klien
$mime = $request->file('doc')->getClientMimeType();  // Bisa dipalsukan
```

```javascript
// RENTAN — Tanpa batasan pada upload
app.post('/upload', upload.single('file'), (req, res) => {
  fs.renameSync(req.file.path, `uploads/${req.file.originalname}`);
  // Nama file asli bisa mengandung path traversal: ../../etc/passwd
});
```

### Cara Memperbaiki

```php
// AMAN — Validasi tipe file, ukuran, dan buat nama yang aman
$request->validate([
    'avatar' => 'required|file|mimes:jpg,png,gif|max:2048',
]);
$path = $request->file('avatar')->store('avatars', 'public');

// AMAN — Cek MIME type yang sebenarnya, bukan dari klien
$mime = $request->file('avatar')->getMimeType();  // Deteksi sisi server
$allowed = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($mime, $allowed)) { abort(422); }
```

```javascript
// AMAN — Validasi dengan multer dan file-type
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import { randomUUID } from 'crypto';

const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    cb(null, allowed.includes(file.mimetype));
  },
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const type = await fileTypeFromBuffer(req.file.buffer);
  if (!type || !['jpg', 'png', 'gif'].includes(type.ext)) {
    return res.status(422).json({ error: 'Tipe file tidak valid' });
  }
  const safeName = `${randomUUID()}.${type.ext}`;
  // Simpan dengan nama aman, jangan pernah pakai originalname
});
```

### Poin Penting

- Selalu validasi tipe file di sisi server, bukan hanya di klien
- Buat nama file acak — jangan pernah pakai nama file asli
- Batasi ukuran file untuk mencegah denial of service
- Simpan upload di luar web root atau gunakan CDN
- Scan file yang diupload untuk malware jika memungkinkan
