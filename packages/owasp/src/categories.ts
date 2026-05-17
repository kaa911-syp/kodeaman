import type { OwaspCategory } from "@aspidasec/schema";
import type { OwaspCategoryDefinition } from "./types.js";

export const OWASP_CATEGORIES: readonly OwaspCategoryDefinition[] = [
  {
    code: "A01",
    id: "A01-broken-access-control",
    titleEn: "Broken Access Control",
    titleId: "Kontrol Akses Rusak",
    descriptionEn:
      "Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of data, or performing a business function outside the user's limits.",
    descriptionId:
      "Kontrol akses memberlakukan kebijakan sehingga pengguna tidak dapat bertindak di luar izin yang dimaksudkan. Kegagalan biasanya mengarah pada pengungkapan informasi yang tidak sah, modifikasi, atau penghancuran data, atau melakukan fungsi bisnis di luar batas pengguna.",
    cweIds: [
      200, 284, 285, 352, 359, 377, 402, 425, 441, 497, 538, 540, 548, 552,
      566, 601, 639, 651, 668, 706, 862, 863, 913, 922, 1275,
    ],
    findingCategories: ["auth", "csrf", "info-leak", "misconfiguration"],
    semgrepRules: [
      "broken-access-control",
      "missing-authorization",
      "idor",
      "path-traversal",
      "open-redirect",
    ],
    zapPolicies: ["10010", "10011", "10020", "10035", "10055", "40012"],
  },
  {
    code: "A02",
    id: "A02-cryptographic-failures",
    titleEn: "Cryptographic Failures",
    titleId: "Kegagalan Kriptografi",
    descriptionEn:
      "Failures related to cryptography which often lead to exposure of sensitive data. This includes use of weak cryptographic algorithms, insufficient key management, and transmission of data in clear text.",
    descriptionId:
      "Kegagalan terkait kriptografi yang sering menyebabkan paparan data sensitif. Ini termasuk penggunaan algoritma kriptografi yang lemah, manajemen kunci yang tidak memadai, dan transmisi data dalam teks biasa.",
    cweIds: [
      261, 296, 310, 319, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330,
      331, 335, 336, 337, 338, 340, 347, 384, 523, 720, 757, 770, 916, 1004,
    ],
    findingCategories: ["config", "info-leak", "misconfiguration"],
    semgrepRules: [
      "crypto-weak-algorithm",
      "crypto-weak-hash",
      "crypto-weak-key",
      "cleartext-transmission",
      "insecure-tls",
    ],
    zapPolicies: ["10011", "10040", "10041", "90003"],
  },
  {
    code: "A03",
    id: "A03-injection",
    titleEn: "Injection",
    titleId: "Injeksi",
    descriptionEn:
      "Injection flaws, such as SQL, NoSQL, OS, and LDAP injection, occur when untrusted data is sent to an interpreter as part of a command or query. The attacker's hostile data can trick the interpreter into executing unintended commands or accessing data without proper authorization.",
    descriptionId:
      "Kelemahan injeksi, seperti SQL, NoSQL, OS, dan injeksi LDAP, terjadi ketika data yang tidak tepercaya dikirim ke interpreter sebagai bagian dari perintah atau kueri. Data berbahaya penyerang dapat menipu interpreter untuk mengeksekusi perintah yang tidak diinginkan atau mengakses data tanpa otorisasi yang tepat.",
    cweIds: [
      20, 74, 75, 77, 78, 79, 80, 83, 87, 88, 89, 90, 91, 93, 94, 95, 96, 97,
      98, 99, 100, 113, 116, 138, 184, 470, 471, 564, 610, 643, 644, 652, 917,
    ],
    findingCategories: [
      "input-validation",
      "xss",
      "sqli",
      "rce",
      "sast",
      "dast",
    ],
    semgrepRules: [
      "sql-injection",
      "xss",
      "command-injection",
      "code-injection",
      "ldap-injection",
      "xpath-injection",
      "template-injection",
    ],
    zapPolicies: [
      "40012", "40014", "40016", "40017", "40018", "40019", "40024", "90020",
    ],
  },
  {
    code: "A04",
    id: "A04-insecure-design",
    titleEn: "Insecure Design",
    titleId: "Desain Tidak Aman",
    descriptionEn:
      "Insecure design is a broad category representing different weaknesses, expressed as missing or ineffective control design. It calls for more use of threat modeling, secure design patterns, and reference architectures.",
    descriptionId:
      "Desain tidak aman adalah kategori luas yang mewakili berbagai kelemahan, dinyatakan sebagai desain kontrol yang hilang atau tidak efektif. Ini memerlukan lebih banyak penggunaan pemodelan ancaman, pola desain aman, dan arsitektur referensi.",
    cweIds: [
      73, 183, 209, 213, 235, 256, 257, 266, 269, 280, 311, 312, 313, 316,
      419, 430, 434, 451, 472, 501, 522, 525, 539, 579, 598, 602, 642, 646,
      650, 653, 656, 657, 799, 807, 840, 841, 927, 1021, 1173,
    ],
    findingCategories: [
      "file-upload",
      "auth",
      "info-leak",
      "misconfiguration",
    ],
    semgrepRules: [
      "insecure-design",
      "missing-rate-limit",
      "unrestricted-upload",
      "business-logic",
    ],
    zapPolicies: ["10015", "10017", "10024", "10056", "90027"],
  },
  {
    code: "A05",
    id: "A05-security-misconfiguration",
    titleEn: "Security Misconfiguration",
    titleId: "Kesalahan Konfigurasi Keamanan",
    descriptionEn:
      "Security misconfiguration is the most commonly seen issue. This is commonly a result of insecure default configurations, incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages containing sensitive information.",
    descriptionId:
      "Kesalahan konfigurasi keamanan adalah masalah yang paling sering terlihat. Ini biasanya merupakan hasil dari konfigurasi default yang tidak aman, konfigurasi yang tidak lengkap atau ad hoc, penyimpanan cloud terbuka, header HTTP yang salah konfigurasi, dan pesan error verbose yang mengandung informasi sensitif.",
    cweIds: [
      2, 11, 13, 15, 16, 17, 56, 73, 209, 260, 266, 269, 280, 284, 311, 312,
      313, 317, 377, 489, 497, 502, 521, 525, 537, 540, 548, 552, 553, 556,
      564, 611, 614, 756, 776, 942, 1004, 1032, 1174,
    ],
    findingCategories: ["config", "misconfiguration", "info-leak"],
    semgrepRules: [
      "security-misconfiguration",
      "debug-enabled",
      "default-credentials",
      "cors-misconfiguration",
      "xxe",
    ],
    zapPolicies: [
      "10010", "10011", "10015", "10017", "10020", "10021", "10036", "10037",
      "10038", "10039", "90001",
    ],
  },
  {
    code: "A06",
    id: "A06-vulnerable-components",
    titleEn: "Vulnerable and Outdated Components",
    titleId: "Komponen yang Rentan dan Usang",
    descriptionEn:
      "Components, such as libraries, frameworks, and other software modules, run with the same privileges as the application. If a vulnerable component is exploited, such an attack can facilitate serious data loss or server takeover.",
    descriptionId:
      "Komponen, seperti pustaka, framework, dan modul perangkat lunak lainnya, berjalan dengan hak istimewa yang sama dengan aplikasi. Jika komponen yang rentan dieksploitasi, serangan semacam itu dapat memfasilitasi kehilangan data serius atau pengambilalihan server.",
    cweIds: [937, 1035, 1104],
    findingCategories: ["sca"],
    semgrepRules: ["vulnerable-dependency", "outdated-component"],
    zapPolicies: ["10021"],
  },
  {
    code: "A07",
    id: "A07-auth-failures",
    titleEn: "Identification and Authentication Failures",
    titleId: "Kegagalan Identifikasi dan Autentikasi",
    descriptionEn:
      "Confirmation of the user's identity, authentication, and session management is critical to protect against authentication-related attacks. Application functions related to authentication and session management are often implemented incorrectly.",
    descriptionId:
      "Konfirmasi identitas pengguna, autentikasi, dan manajemen sesi sangat penting untuk melindungi dari serangan terkait autentikasi. Fungsi aplikasi yang terkait dengan autentikasi dan manajemen sesi sering diimplementasikan secara tidak benar.",
    cweIds: [
      255, 259, 287, 288, 290, 294, 295, 297, 300, 302, 304, 306, 307, 346,
      384, 521, 613, 620, 640, 798, 940, 1216,
    ],
    findingCategories: ["auth", "secrets"],
    semgrepRules: [
      "auth-bypass",
      "weak-password",
      "session-fixation",
      "hardcoded-credentials",
      "missing-authentication",
    ],
    zapPolicies: ["10010", "10011", "10023", "10054", "10057"],
  },
  {
    code: "A08",
    id: "A08-data-integrity-failures",
    titleEn: "Software and Data Integrity Failures",
    titleId: "Kegagalan Integritas Perangkat Lunak dan Data",
    descriptionEn:
      "Software and data integrity failures relate to code and infrastructure that does not protect against integrity violations. This includes insecure deserialization, use of software from untrusted sources, and CI/CD pipelines without integrity verification.",
    descriptionId:
      "Kegagalan integritas perangkat lunak dan data terkait dengan kode dan infrastruktur yang tidak melindungi terhadap pelanggaran integritas. Ini termasuk deserialisasi yang tidak aman, penggunaan perangkat lunak dari sumber yang tidak tepercaya, dan pipeline CI/CD tanpa verifikasi integritas.",
    cweIds: [
      345, 346, 347, 353, 426, 427, 428, 434, 459, 490, 494, 502, 565, 784,
      829, 830, 915,
    ],
    findingCategories: ["config", "file-upload", "sca"],
    semgrepRules: [
      "insecure-deserialization",
      "unsigned-code",
      "cicd-integrity",
    ],
    zapPolicies: ["10029", "90034"],
  },
  {
    code: "A09",
    id: "A09-logging-monitoring-failures",
    titleEn: "Security Logging and Monitoring Failures",
    titleId: "Kegagalan Pencatatan dan Pemantauan Keamanan",
    descriptionEn:
      "Insufficient logging, detection, monitoring, and active response allows attackers to further attack systems, maintain persistence, pivot to more systems, and tamper, extract, or destroy data.",
    descriptionId:
      "Pencatatan, deteksi, pemantauan, dan respons aktif yang tidak memadai memungkinkan penyerang untuk lebih lanjut menyerang sistem, mempertahankan persistensi, beralih ke lebih banyak sistem, dan merusak, mengekstrak, atau menghancurkan data.",
    cweIds: [117, 223, 532, 778],
    findingCategories: ["config", "misconfiguration"],
    semgrepRules: [
      "insufficient-logging",
      "log-injection",
      "sensitive-data-logging",
    ],
    zapPolicies: ["10011"],
  },
  {
    code: "A10",
    id: "A10-ssrf",
    titleEn: "Server-Side Request Forgery (SSRF)",
    titleId: "Pemalsuan Permintaan Sisi Server (SSRF)",
    descriptionEn:
      "SSRF flaws occur whenever a web application is fetching a remote resource without validating the user-supplied URL. It allows an attacker to coerce the application to send a crafted request to an unexpected destination.",
    descriptionId:
      "Kelemahan SSRF terjadi setiap kali aplikasi web mengambil sumber daya jarak jauh tanpa memvalidasi URL yang diberikan pengguna. Ini memungkinkan penyerang memaksa aplikasi untuk mengirim permintaan yang dibuat ke tujuan yang tidak terduga.",
    cweIds: [918],
    findingCategories: ["ssrf", "dast"],
    semgrepRules: ["ssrf", "url-redirect-to-internal"],
    zapPolicies: ["40046"],
  },
] as const;

/** Lookup map from OWASP category ID to its definition. */
export const OWASP_BY_ID: ReadonlyMap<OwaspCategory, OwaspCategoryDefinition> =
  new Map(OWASP_CATEGORIES.map((c) => [c.id, c]));

/** Lookup map from OWASP code (e.g. "A01") to its definition. */
export const OWASP_BY_CODE: ReadonlyMap<string, OwaspCategoryDefinition> =
  new Map(OWASP_CATEGORIES.map((c) => [c.code, c]));

/**
 * Build a reverse lookup from CWE ID to OWASP category IDs.
 * A single CWE may map to multiple OWASP categories.
 */
function buildCweIndex(): ReadonlyMap<number, OwaspCategory[]> {
  const index = new Map<number, OwaspCategory[]>();
  for (const cat of OWASP_CATEGORIES) {
    for (const cwe of cat.cweIds) {
      const existing = index.get(cwe);
      if (existing) {
        existing.push(cat.id);
      } else {
        index.set(cwe, [cat.id]);
      }
    }
  }
  return index;
}

/** Reverse lookup from CWE ID to OWASP category IDs. */
export const CWE_TO_OWASP: ReadonlyMap<number, OwaspCategory[]> =
  buildCweIndex();

// --- Backward-compatible aliases used by orchestrator.ts / progress.ts ---

export type OwaspCategoryId =
  | "A01"
  | "A02"
  | "A03"
  | "A04"
  | "A05"
  | "A06"
  | "A07"
  | "A08"
  | "A09"
  | "A10";

export function getAllCategoryIds(): OwaspCategoryId[] {
  return OWASP_CATEGORIES.map((c) => c.code as OwaspCategoryId);
}

export function getCategoryById(
  id: OwaspCategoryId,
): OwaspCategoryDefinition | undefined {
  return OWASP_BY_CODE.get(id);
}
