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

