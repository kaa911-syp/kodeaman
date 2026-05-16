import { describe, it, expect } from "vitest";
import { HtmlReportGenerator } from "../html-report.js";
import type { OwaspScanReport, OwaspCategoryResult } from "../html-report.js";
import type { ReportConfig } from "../types.js";
import { DEFAULT_REPORT_CONFIG } from "../types.js";
import { getStyles } from "../styles.js";
import {
  OWASP_CATEGORIES,
  headerTemplate,
  evidenceCardTemplate,
  gamificationTemplate,
  footerTemplate,
} from "../templates.js";
import type { NormalizedFinding } from "@kodeaman/schema";

function makeFinding(
  overrides: Partial<NormalizedFinding> = {},
): NormalizedFinding {
  return {
    schemaVersion: "1.0.0",
    findingId: "test-001",
    dedupeKey: "test-dedupe-001",
    source: "semgrep",
    category: "sqli",
    surface: "source-code",
    severity: "high",
    confidence: "high",
    status: "open",
    title: "SQL Injection in query builder",
    description: "User input passed directly to SQL query",
    location: {
      filePath: "app/Models/User.php",
      startLine: 44,
      snippet: "$query = \"SELECT * FROM users WHERE name = '\" . $name . \"'\";",
    },
    evidence: [],
    classification: {
      cwe: ["CWE-89"],
      owasp: ["A03:2021"],
    },
    raw: {
      tool: "semgrep",
      toolRuleId: "php.lang.security.injection.tainted-sql-string",
    },
    prioritization: {
      baseSeverity: "high",
      adjustedSeverity: "high",
      priorityScore: 85,
      confidenceScore: 90,
      reasons: ["Direct user input in SQL query"],
    },
    coaching: {
      titleEn: "SQL Injection Vulnerability",
      titleId: "Kerentanan SQL Injection",
      summaryEn: "User input is concatenated into SQL query",
      summaryId: "Input pengguna digabungkan ke query SQL",
      whyItMattersEn:
        "Attackers can manipulate database queries to access or modify data",
      whyItMattersId:
        "Penyerang bisa memanipulasi query database untuk mengakses atau mengubah data",
      remediationEn: [
        "Use parameterized queries",
        "Use an ORM query builder",
      ],
      remediationId: [
        "Gunakan parameterized queries",
        "Gunakan ORM query builder",
      ],
      safeExampleCode:
        "$users = DB::table('users')->where('name', $name)->get();",
      lessonSlug: "sql-injection-basics",
      lessonEstimatedMinutes: 4,
    },
    gamification: {
      issueFamily: "injection",
      xpReward: 50,
      badgeKey: "first-fix",
      streakEligible: true,
    },
    detectedAt: "2026-01-15T10:00:00Z",
    ...overrides,
  };
}

function makeReport(
  overrides: Partial<OwaspScanReport> = {},
): OwaspScanReport {
  const finding = makeFinding();
  return {
    scanId: "scan-001",
    startedAt: "2026-01-15T10:00:00Z",
    completedAt: "2026-01-15T10:01:00Z",
    environment: "local",
    totalFindings: 1,
    bySeverity: { critical: 0, high: 1, medium: 0, low: 0, info: 0 },
    scannersUsed: ["semgrep"],
    categories: [
      {
        categoryId: "A03",
        findings: [finding],
      },
    ],
    ...overrides,
  };
}

function makeConfig(
  overrides: Partial<ReportConfig> = {},
): ReportConfig {
  return { ...DEFAULT_REPORT_CONFIG, ...overrides };
}

describe("HtmlReportGenerator", () => {
  const generator = new HtmlReportGenerator();

  it("should generate a valid HTML document with doctype and closing tags", () => {
    const report = makeReport();
    const html = generator.generateReport(report, makeConfig());

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
    expect(html).toContain("<head>");
    expect(html).toContain("</head>");
    expect(html).toContain("<body>");
    expect(html).toContain("</body>");
  });

  it("should include KodeAman branding in header", () => {
    const report = makeReport();
    const html = generator.generateReport(report, makeConfig());

    expect(html).toContain("KodeAman");
    expect(html).toContain("logo-text");
  });

  it("should render report in Bahasa Indonesia locale", () => {
    const report = makeReport();
    const html = generator.generateReport(
      report,
      makeConfig({ locale: "id" }),
    );

    expect(html).toContain("Laporan Keamanan");
    expect(html).toContain("Kerentanan SQL Injection");
    expect(html).toContain("Kenapa ini penting");
    expect(html).toContain("Cara Memperbaiki");
  });

  it("should render report in English locale", () => {
    const report = makeReport();
    const html = generator.generateReport(
      report,
      makeConfig({ locale: "en" }),
    );

    expect(html).toContain("Security Report");
    expect(html).toContain("SQL Injection Vulnerability");
    expect(html).toContain("Why it matters");
    expect(html).toContain("How to Fix");
  });

  it("should include inline CSS styles", () => {
    const report = makeReport();
    const html = generator.generateReport(report, makeConfig());

    expect(html).toContain("<style>");
    expect(html).toContain("--color-critical: #dc2626");
    expect(html).toContain("--color-high: #ea580c");
    expect(html).toContain("--color-medium: #ca8a04");
    expect(html).toContain("--color-low: #2563eb");
    expect(html).toContain("--color-info: #6b7280");
  });

  it("should render OWASP dashboard with A01-A10 categories", () => {
    const report = makeReport();
    const html = generator.generateReport(report, makeConfig());

    for (const cat of OWASP_CATEGORIES) {
      expect(html).toContain(cat.id);
    }
    expect(html).toContain("owasp-grid");
  });

  it("should render evidence cards with severity badge and code snippet", () => {
    const report = makeReport();
    const html = generator.generateReport(report, makeConfig());

    expect(html).toContain("evidence-card");
    expect(html).toContain("severity-badge high");
    expect(html).toContain("HIGH");
    expect(html).toContain("snippet-block");
    expect(html).toContain("SELECT * FROM users");
  });

  it("should include CWE and OWASP references", () => {
    const report = makeReport();
    const html = generator.generateReport(report, makeConfig());

    expect(html).toContain("CWE-89");
    expect(html).toContain("A03:2021");
    expect(html).toContain("ref-tag");
  });

  it("should include confidence indicator", () => {
    const report = makeReport();
    const html = generator.generateReport(report, makeConfig());

    expect(html).toContain("confidence-indicator");
    expect(html).toContain("confidence-dot active");
  });

  it("should render gamification section when enabled", () => {
    const report = makeReport();
    const html = generator.generateReport(
      report,
      makeConfig({ gamificationEnabled: true }),
    );

    expect(html).toContain("gamification-section");
    expect(html).toContain("+50");
    expect(html).toContain("first-fix");
  });

  it("should NOT render gamification section when disabled", () => {
    const report = makeReport();
    const html = generator.generateReport(
      report,
      makeConfig({ gamificationEnabled: false }),
    );

    // The CSS will contain the class name, but the actual section element should not be rendered
    expect(html).not.toContain("<section class=\"gamification-section\">");
  });

  it("should render footer with KodeAman attribution", () => {
    const report = makeReport();
    const html = generator.generateReport(
      report,
      makeConfig({ locale: "id" }),
    );

    expect(html).toContain("report-footer");
    expect(html).toContain("Dibuat oleh KodeAman");
  });

  it("should apply dark theme data attribute", () => {
    const report = makeReport();
    const html = generator.generateReport(
      report,
      makeConfig({ theme: "dark" }),
    );

    expect(html).toContain('data-theme="dark"');
  });

  it("should apply light theme data attribute", () => {
    const report = makeReport();
    const html = generator.generateReport(
      report,
      makeConfig({ theme: "light" }),
    );

    expect(html).toContain('data-theme="light"');
  });

  it("should not set data-theme for auto theme", () => {
    const report = makeReport();
    const html = generator.generateReport(
      report,
      makeConfig({ theme: "auto" }),
    );

    // The CSS selectors contain data-theme, but the <html> tag should not have the attribute
    expect(html).toMatch(/<html lang="id">/);
    expect(html).not.toMatch(/<html[^>]+data-theme=/);
  });

  it("should respect maxFindingsPerCategory", () => {
    const findings = Array.from({ length: 5 }, (_, i) =>
      makeFinding({ findingId: `f-${i}`, title: `Finding ${i}` }),
    );
    const report = makeReport({
      totalFindings: 5,
      categories: [{ categoryId: "A03", findings }],
    });
    const html = generator.generateReport(
      report,
      makeConfig({ maxFindingsPerCategory: 2 }),
    );

    const cardCount = (html.match(/class="evidence-card"/g) || []).length;
    expect(cardCount).toBe(2);
  });

  it("should handle multiple categories", () => {
    const categories: OwaspCategoryResult[] = [
      { categoryId: "A01", findings: [makeFinding({ findingId: "a01-1" })] },
      { categoryId: "A03", findings: [makeFinding({ findingId: "a03-1" })] },
      { categoryId: "A07", findings: [makeFinding({ findingId: "a07-1" })] },
    ];
    const report = makeReport({
      totalFindings: 3,
      categories,
    });
    const html = generator.generateReport(report, makeConfig());

    expect(html).toContain("A01");
    expect(html).toContain("A03");
    expect(html).toContain("A07");
    const sectionCount = (
      html.match(/class="category-section"/g) || []
    ).length;
    expect(sectionCount).toBe(3);
  });

  it("should escape HTML in finding titles to prevent XSS", () => {
    const finding = makeFinding({
      coaching: {
        ...makeFinding().coaching,
        titleEn: '<script>alert("xss")</script>',
        titleId: '<script>alert("xss")</script>',
      },
    });
    const card = generator.generateEvidenceCard(finding, "en");

    expect(card).not.toContain("<script>");
    expect(card).toContain("&lt;script&gt;");
  });

  it("should render file path with line number", () => {
    const finding = makeFinding();
    const card = generator.generateEvidenceCard(finding, "en");

    expect(card).toContain("app/Models/User.php:44");
  });

  it("should render URL location when filePath is absent", () => {
    const finding = makeFinding({
      location: {
        url: "https://example.com/api/users",
      },
    });
    const card = generator.generateEvidenceCard(finding, "en");

    expect(card).toContain("https://example.com/api/users");
  });
});

describe("getStyles", () => {
  it("should return CSS with severity color variables", () => {
    const css = getStyles();
    expect(css).toContain("--color-critical: #dc2626");
    expect(css).toContain("--color-high: #ea580c");
    expect(css).toContain("prefers-color-scheme: dark");
  });

  it("should include print media query", () => {
    const css = getStyles();
    expect(css).toContain("@media print");
  });

  it("should include responsive mobile styles", () => {
    const css = getStyles();
    expect(css).toContain("@media (max-width: 640px)");
  });
});

describe("templates", () => {
  it("headerTemplate should include scan metadata", () => {
    const html = headerTemplate({
      scanDate: "2026-01-15T10:00:00Z",
      environment: "production",
      totalFindings: 5,
      bySeverity: { critical: 1, high: 2, medium: 1, low: 1, info: 0 },
      repoName: "org/repo",
      branch: "main",
      locale: "en",
      theme: "auto",
    });

    expect(html).toContain("2026-01-15T10:00:00Z");
    expect(html).toContain("production");
    expect(html).toContain("org/repo");
    expect(html).toContain("main");
    expect(html).toContain("5");
  });

  it("footerTemplate should include bilingual attribution", () => {
    const enFooter = footerTemplate("en", "2026-01-15T10:00:00Z");
    expect(enFooter).toContain("Generated by KodeAman");

    const idFooter = footerTemplate("id", "2026-01-15T10:00:00Z");
    expect(idFooter).toContain("Dibuat oleh KodeAman");
  });

  it("gamificationTemplate should show XP and badges", () => {
    const html = gamificationTemplate({
      xpEarned: 150,
      badges: ["first-fix", "streak-master"],
      streaks: 3,
      locale: "en",
    });

    expect(html).toContain("+150");
    expect(html).toContain("first-fix");
    expect(html).toContain("streak-master");
    expect(html).toContain("3");
  });

  it("evidenceCardTemplate should render all fields", () => {
    const html = evidenceCardTemplate({
      title: "Test Finding",
      severity: "critical",
      filePath: "src/index.ts",
      startLine: 10,
      snippet: "const x = eval(input);",
      whyItMatters: "Remote code execution risk",
      remediation: ["Remove eval", "Use safer alternative"],
      cwes: ["CWE-94"],
      owaspRefs: ["A03:2021"],
      confidence: "high",
      locale: "en",
    });

    expect(html).toContain("severity-badge critical");
    expect(html).toContain("CRITICAL");
    expect(html).toContain("src/index.ts:10");
    expect(html).toContain("eval(input)");
    expect(html).toContain("Remote code execution risk");
    expect(html).toContain("Remove eval");
    expect(html).toContain("CWE-94");
    expect(html).toContain("A03:2021");
  });
});
