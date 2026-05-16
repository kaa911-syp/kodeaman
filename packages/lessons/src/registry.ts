import type { LessonMeta } from "./types.js";

const lessons: LessonMeta[] = [
  {
    id: "sqli-001",
    slug: "sql-injection-basics",
    titleEn: "SQL Injection Basics",
    titleId: "Dasar-Dasar SQL Injection",
    level: "beginner",
    estimatedMinutes: 5,
    categories: ["sqli", "input-validation"],
    tags: ["sql", "injection", "database", "query"],
    contentPath: "content/lesson-sqli-001.md",
  },
  {
    id: "xss-001",
    slug: "xss-fundamentals",
    titleEn: "XSS Fundamentals",
    titleId: "Fundamental XSS",
    level: "beginner",
    estimatedMinutes: 5,
    categories: ["xss", "input-validation"],
    tags: ["xss", "script", "html", "sanitize"],
    contentPath: "content/lesson-xss-001.md",
  },
  {
    id: "csrf-001",
    slug: "csrf-protection",
    titleEn: "CSRF Protection",
    titleId: "Perlindungan CSRF",
    level: "beginner",
    estimatedMinutes: 4,
    categories: ["csrf", "auth"],
    tags: ["csrf", "token", "form", "request"],
    contentPath: "content/lesson-csrf-001.md",
  },
  {
    id: "secrets-001",
    slug: "secret-management",
    titleEn: "Secret Management",
    titleId: "Manajemen Secret",
    level: "beginner",
    estimatedMinutes: 4,
    categories: ["secrets", "config"],
    tags: ["secret", "env", "credential", "api-key"],
    contentPath: "content/lesson-secrets-001.md",
  },
  {
    id: "auth-001",
    slug: "authentication-best-practices",
    titleEn: "Authentication Best Practices",
    titleId: "Praktik Terbaik Autentikasi",
    level: "intermediate",
    estimatedMinutes: 6,
    categories: ["auth"],
    tags: ["auth", "password", "session", "jwt"],
    contentPath: "content/lesson-auth-001.md",
  },
  {
    id: "upload-001",
    slug: "safe-file-uploads",
    titleEn: "Safe File Uploads",
    titleId: "Upload File yang Aman",
    level: "intermediate",
    estimatedMinutes: 5,
    categories: ["file-upload"],
    tags: ["upload", "file", "mime", "validation"],
    contentPath: "content/lesson-upload-001.md",
  },
  {
    id: "config-001",
    slug: "secure-configuration",
    titleEn: "Secure Configuration",
    titleId: "Konfigurasi yang Aman",
    level: "beginner",
    estimatedMinutes: 4,
    categories: ["config", "misconfiguration"],
    tags: ["config", "debug", "production", "env"],
    contentPath: "content/lesson-config-001.md",
  },
  {
    id: "input-001",
    slug: "input-validation",
    titleEn: "Input Validation",
    titleId: "Validasi Input",
    level: "beginner",
    estimatedMinutes: 5,
    categories: ["input-validation"],
    tags: ["input", "validation", "sanitize", "whitelist"],
    contentPath: "content/lesson-input-001.md",
  },
  {
    id: "cors-001",
    slug: "cors-configuration",
    titleEn: "CORS Configuration",
    titleId: "Konfigurasi CORS",
    level: "intermediate",
    estimatedMinutes: 5,
    categories: ["misconfiguration"],
    tags: ["cors", "origin", "header", "api"],
    contentPath: "content/lesson-cors-001.md",
  },
  {
    id: "crypto-001",
    slug: "cryptography-basics",
    titleEn: "Cryptography Basics",
    titleId: "Dasar-Dasar Kriptografi",
    level: "intermediate",
    estimatedMinutes: 6,
    categories: ["sast"],
    tags: ["crypto", "hash", "encrypt", "algorithm"],
    contentPath: "content/lesson-crypto-001.md",
  },
  {
    id: "insecure-design-001",
    slug: "insecure-design",
    titleEn: "Insecure Design",
    titleId: "Desain Tidak Aman",
    level: "intermediate",
    estimatedMinutes: 6,
    categories: ["auth", "input-validation", "misconfiguration"],
    tags: ["design", "threat-modeling", "architecture", "owasp-a04"],
    contentPath: "content/lesson-insecure-design-001.md",
  },
  {
    id: "sca-001",
    slug: "vulnerable-components",
    titleEn: "Vulnerable Components",
    titleId: "Komponen Rentan",
    level: "beginner",
    estimatedMinutes: 5,
    categories: ["sca"],
    tags: ["dependency", "npm-audit", "semver", "dependabot", "owasp-a06"],
    contentPath: "content/lesson-sca-001.md",
  },
  {
    id: "data-integrity-001",
    slug: "data-integrity-failures",
    titleEn: "Data Integrity Failures",
    titleId: "Kegagalan Integritas Data",
    level: "intermediate",
    estimatedMinutes: 6,
    categories: ["config", "sca"],
    tags: ["ci-cd", "deserialization", "sri", "integrity", "owasp-a08"],
    contentPath: "content/lesson-data-integrity-001.md",
  },
  {
    id: "logging-001",
    slug: "security-logging-monitoring",
    titleEn: "Security Logging & Monitoring",
    titleId: "Logging & Monitoring Keamanan",
    level: "intermediate",
    estimatedMinutes: 5,
    categories: ["config", "misconfiguration"],
    tags: ["logging", "monitoring", "alerting", "pii", "owasp-a09"],
    contentPath: "content/lesson-logging-001.md",
  },
];

export class LessonRegistry {
  private lessons: LessonMeta[];

  constructor() {
    this.lessons = lessons;
  }

  getLesson(lessonId: string): LessonMeta | undefined {
    return this.lessons.find((l) => l.id === lessonId);
  }

  getLessonByCategory(category: string): LessonMeta[] {
    return this.lessons.filter((l) => l.categories.includes(category));
  }

  getLessonBySlug(slug: string): LessonMeta | undefined {
    return this.lessons.find((l) => l.slug === slug);
  }

  getAllLessons(): LessonMeta[] {
    return [...this.lessons];
  }
}
