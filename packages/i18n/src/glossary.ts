export interface GlossaryEntry {
  term: string;
  en: string;
  id: string;
}

export const securityGlossary: GlossaryEntry[] = [
  {
    term: "SQL Injection",
    en: "An attack where malicious SQL code is inserted into application queries, allowing attackers to read, modify, or delete database data.",
    id: "Serangan di mana kode SQL berbahaya disisipkan ke dalam query aplikasi, memungkinkan penyerang membaca, mengubah, atau menghapus data di database.",
  },
  {
    term: "XSS (Cross-Site Scripting)",
    en: "An attack that injects malicious scripts into web pages viewed by other users, enabling session hijacking, defacement, or credential theft.",
    id: "Serangan yang menyisipkan skrip berbahaya ke halaman web yang dilihat pengguna lain, memungkinkan pembajakan sesi, perusakan tampilan, atau pencurian kredensial.",
  },
  {
    term: "CSRF (Cross-Site Request Forgery)",
    en: "An attack that tricks a logged-in user into submitting unwanted requests to a web application they're authenticated with.",
    id: "Serangan yang mengelabui pengguna yang sudah login untuk mengirim request yang tidak diinginkan ke aplikasi web tempat mereka terautentikasi.",
  },
  {
    term: "Authentication",
    en: "The process of verifying a user's identity, typically through credentials like username and password.",
    id: "Proses verifikasi identitas pengguna, biasanya melalui kredensial seperti username dan password.",
  },
  {
    term: "Authorization",
    en: "The process of determining what actions or resources an authenticated user is allowed to access.",
    id: "Proses menentukan aksi atau resource apa yang boleh diakses oleh pengguna yang sudah terautentikasi.",
  },
  {
    term: "Hardcoded Secret",
    en: "A credential, API key, or password embedded directly in source code instead of being stored in secure configuration.",
    id: "Kredensial, API key, atau password yang ditulis langsung di source code, bukan disimpan di konfigurasi yang aman.",
  },
  {
    term: "Path Traversal",
    en: "An attack that manipulates file paths to access files outside the intended directory, potentially exposing sensitive system files.",
    id: "Serangan yang memanipulasi path file untuk mengakses file di luar direktori yang seharusnya, berpotensi mengekspos file sistem yang sensitif.",
  },
  {
    term: "CORS (Cross-Origin Resource Sharing)",
    en: "A browser security mechanism that controls which domains can make requests to your API. Misconfigured CORS can expose your API to unauthorized access.",
    id: "Mekanisme keamanan browser yang mengontrol domain mana yang boleh membuat request ke API kamu. CORS yang salah konfigurasi bisa mengekspos API ke akses yang tidak sah.",
  },
  {
    term: "JWT (JSON Web Token)",
    en: "A compact token format used for authentication. Weak JWT configuration (e.g., using 'none' algorithm) can lead to authentication bypass.",
    id: "Format token kompak yang digunakan untuk autentikasi. Konfigurasi JWT yang lemah (misalnya menggunakan algoritma 'none') bisa menyebabkan bypass autentikasi.",
  },
  {
    term: "Mass Assignment",
    en: "A vulnerability where an attacker can modify object properties they shouldn't have access to by manipulating request parameters.",
    id: "Kerentanan di mana penyerang bisa mengubah properti objek yang seharusnya tidak bisa diakses dengan memanipulasi parameter request.",
  },
  {
    term: "SAST (Static Application Security Testing)",
    en: "Security testing that analyzes source code without executing it to find potential vulnerabilities.",
    id: "Pengujian keamanan yang menganalisis source code tanpa menjalankannya untuk menemukan potensi kerentanan.",
  },
  {
    term: "DAST (Dynamic Application Security Testing)",
    en: "Security testing that analyzes a running application by sending requests and observing responses to find vulnerabilities.",
    id: "Pengujian keamanan yang menganalisis aplikasi yang sedang berjalan dengan mengirim request dan mengamati respons untuk menemukan kerentanan.",
  },
  {
    term: "RCE (Remote Code Execution)",
    en: "A critical vulnerability that allows an attacker to execute arbitrary code on a remote server or system.",
    id: "Kerentanan kritis yang memungkinkan penyerang mengeksekusi kode sembarang di server atau sistem remote.",
  },
  {
    term: "SSRF (Server-Side Request Forgery)",
    en: "An attack where the server is tricked into making requests to unintended locations, potentially accessing internal services.",
    id: "Serangan di mana server dikelabui untuk membuat request ke lokasi yang tidak seharusnya, berpotensi mengakses layanan internal.",
  },
  {
    term: "Open Redirect",
    en: "A vulnerability where an application redirects users to an attacker-controlled URL, often used in phishing attacks.",
    id: "Kerentanan di mana aplikasi mengarahkan pengguna ke URL yang dikontrol penyerang, sering digunakan dalam serangan phishing.",
  },
  {
    term: "Deserialization",
    en: "The process of converting serialized data back into objects. Unsafe deserialization can allow attackers to execute arbitrary code.",
    id: "Proses mengubah data yang sudah di-serialize kembali menjadi objek. Deserialization yang tidak aman bisa memungkinkan penyerang mengeksekusi kode sembarang.",
  },
  {
    term: "Cryptographic Hash",
    en: "A one-way function that converts data into a fixed-length string. Weak algorithms like MD5 or SHA1 are vulnerable to collision attacks.",
    id: "Fungsi satu arah yang mengubah data menjadi string dengan panjang tetap. Algoritma lemah seperti MD5 atau SHA1 rentan terhadap serangan collision.",
  },
  {
    term: "Environment Variable",
    en: "A configuration value stored outside source code, commonly used to store secrets and API keys securely.",
    id: "Nilai konfigurasi yang disimpan di luar source code, biasanya digunakan untuk menyimpan secret dan API key secara aman.",
  },
];

export function lookupGlossary(term: string, locale: "en" | "id" = "en"): string | undefined {
  const entry = securityGlossary.find(
    (e) => e.term.toLowerCase() === term.toLowerCase(),
  );
  return entry?.[locale];
}
