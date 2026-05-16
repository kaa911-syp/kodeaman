import { describe, it, expect } from "vitest";
import { MarkdownRenderer } from "../renderer.js";
import type { ScanResult, OwaspScanReport } from "../renderer.js";
import { CLIRenderer } from "../cli-renderer.js";
import type { NormalizedFinding } from "@kodeaman/schema";

function makeFinding(overrides: Partial<NormalizedFinding> = {}): NormalizedFinding {
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
      whyItMattersEn: "Attackers can manipulate database queries to access or modify data",
      whyItMattersId: "Penyerang bisa memanipulasi query database untuk mengakses atau mengubah data",
      remediationEn: ["Use parameterized queries", "Use an ORM query builder"],
      remediationId: ["Gunakan parameterized queries", "Gunakan ORM query builder"],
      safeExampleCode: "$users = DB::table('users')->where('name', $name)->get();",
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

function makeScanResult(findings: NormalizedFinding[]): ScanResult {
  const bySeverity = { info: 0, low: 0, medium: 0, high: 0, critical: 0 };
  for (const f of findings) {
    bySeverity[f.severity]++;
  }
  return {
    findings,
    summary: {
      totalFindings: findings.length,
      bySeverity,
      scanDurationMs: 1234,
      scannersUsed: ["semgrep"],
    },
  };
}

describe("MarkdownRenderer", () => {
  const renderer = new MarkdownRenderer();

  it("should render PR comment header with KodeAman branding", () => {
    const result = makeScanResult([makeFinding()]);
    const output = renderer.renderPRComment(result, {
      language: "id",
      prioritization: { maxFindingsInComment: 3 },
      gamification: { enabled: true },
    });

    expect(output).toContain("KodeAman Security Report");
    expect(output).toContain("KodeAman");
  });

  it("should render findings in Bahasa Indonesia", () => {
    const result = makeScanResult([makeFinding()]);
    const output = renderer.renderPRComment(result, {
      language: "id",
      prioritization: { maxFindingsInComment: 3 },
      gamification: { enabled: true },
    });

    expect(output).toContain("Kerentanan SQL Injection");
    expect(output).toContain("Kenapa ini penting:");
    expect(output).toContain("Cara memperbaiki:");
    expect(output).toContain("Pelajari lebih lanjut");
  });

  it("should render findings in English", () => {
    const result = makeScanResult([makeFinding()]);
    const output = renderer.renderPRComment(result, {
      language: "en",
      prioritization: { maxFindingsInComment: 3 },
      gamification: { enabled: false },
    });

    expect(output).toContain("SQL Injection Vulnerability");
    expect(output).toContain("Why this matters:");
    expect(output).toContain("How to fix:");
    expect(output).toContain("Learn more");
  });

  it("should show file location", () => {
    const result = makeScanResult([makeFinding()]);
    const output = renderer.renderPRComment(result, {
      language: "id",
      prioritization: { maxFindingsInComment: 3 },
      gamification: { enabled: false },
    });

    expect(output).toContain("`app/Models/User.php:44`");
  });

  it("should render collapsible safe code example", () => {
    const result = makeScanResult([makeFinding()]);
    const output = renderer.renderPRComment(result, {
      language: "id",
      prioritization: { maxFindingsInComment: 3 },
      gamification: { enabled: false },
    });

    expect(output).toContain("<details>");
    expect(output).toContain("DB::table('users')");
  });

  it("should limit top findings to maxFindingsInComment", () => {
    const findings = [
      makeFinding({ findingId: "1", severity: "critical" }),
      makeFinding({ findingId: "2", severity: "high" }),
      makeFinding({ findingId: "3", severity: "medium" }),
      makeFinding({ findingId: "4", severity: "low" }),
    ];
    const result = makeScanResult(findings);
    const output = renderer.renderPRComment(result, {
      language: "id",
      prioritization: { maxFindingsInComment: 2 },
      gamification: { enabled: false },
    });

    expect(output).toContain("Temuan Utama");
    expect(output).toContain("Semua temuan (4 total)");
  });

  it("should render gamification when enabled", () => {
    const result = makeScanResult([makeFinding()]);
    const output = renderer.renderPRComment(result, {
      language: "id",
      prioritization: { maxFindingsInComment: 3 },
      gamification: { enabled: true },
    });

    expect(output).toContain("+50 XP");
    expect(output).toContain("first-fix");
  });

  it("should render summary correctly", () => {
    const summary = {
      totalFindings: 5,
      bySeverity: { info: 1, low: 1, medium: 1, high: 1, critical: 1 },
      scanDurationMs: 1000,
      scannersUsed: ["semgrep"],
    };

    const text = renderer.renderSummary(summary, "id");
    expect(text).toContain("5 masalah");
    expect(text).toContain("1 critical");
    expect(text).toContain("1 high");
  });

  it("should render single finding independently", () => {
    const finding = makeFinding();
    const output = renderer.renderFinding(finding, "en", 1);

    expect(output).toContain("[HIGH]");
    expect(output).toContain("SQL Injection Vulnerability");
    expect(output).toContain("Use parameterized queries");
  });
});

function makeOwaspReport(
  overrides: Partial<OwaspScanReport> = {},
): OwaspScanReport {
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
        findings: [makeFinding()],
      },
    ],
    ...overrides,
  };
}

describe("MarkdownRenderer.renderOwaspReport", () => {
  const renderer = new MarkdownRenderer();

  it("should render OWASP report header", () => {
    const report = makeOwaspReport();
    const output = renderer.renderOwaspReport(report, {
      language: "en",
      gamification: { enabled: false },
    });

    expect(output).toContain("KodeAman OWASP Top 10 Report");
  });

  it("should render A01-A10 dashboard table", () => {
    const report = makeOwaspReport();
    const output = renderer.renderOwaspReport(report, {
      language: "en",
      gamification: { enabled: false },
    });

    expect(output).toContain("A01");
    expect(output).toContain("A10");
    expect(output).toContain("Broken Access Control");
    expect(output).toContain("Injection");
  });

  it("should render in Bahasa Indonesia", () => {
    const report = makeOwaspReport();
    const output = renderer.renderOwaspReport(report, {
      language: "id",
      gamification: { enabled: false },
    });

    expect(output).toContain("Injeksi");
    expect(output).toContain("Kontrol Akses Rusak");
    expect(output).toContain("Ditemukan");
  });

  it("should include finding details per category", () => {
    const report = makeOwaspReport();
    const output = renderer.renderOwaspReport(report, {
      language: "en",
      gamification: { enabled: false },
    });

    expect(output).toContain("### A03: Injection");
    expect(output).toContain("SQL Injection Vulnerability");
  });

  it("should render gamification when enabled", () => {
    const report = makeOwaspReport();
    const output = renderer.renderOwaspReport(report, {
      language: "en",
      gamification: { enabled: true },
    });

    expect(output).toContain("+50 XP");
  });

  it("should respect maxFindingsPerCategory", () => {
    const findings = Array.from({ length: 5 }, (_, i) =>
      makeFinding({ findingId: `f-${i}` }),
    );
    const report = makeOwaspReport({
      totalFindings: 5,
      categories: [{ categoryId: "A03", findings }],
    });
    const output = renderer.renderOwaspReport(report, {
      language: "en",
      gamification: { enabled: false },
      maxFindingsPerCategory: 2,
    });

    expect(output).toContain("and 3 more findings");
  });
});

describe("CLIRenderer.renderOwaspConsole", () => {
  const cliRenderer = new CLIRenderer();

  it("should render OWASP console report header", () => {
    const report = makeOwaspReport();
    const output = cliRenderer.renderOwaspConsole(report, {
      language: "en",
    });

    expect(output).toContain("KodeAman OWASP Top 10 Report");
  });

  it("should render A01-A10 ASCII table", () => {
    const report = makeOwaspReport();
    const output = cliRenderer.renderOwaspConsole(report, {
      language: "en",
    });

    expect(output).toContain("A01");
    expect(output).toContain("A10");
    expect(output).toContain("Injection");
  });

  it("should show category findings in detail", () => {
    const report = makeOwaspReport();
    const output = cliRenderer.renderOwaspConsole(report, {
      language: "en",
    });

    expect(output).toContain("[HIGH]");
    expect(output).toContain("SQL Injection Vulnerability");
  });

  it("should render in Bahasa Indonesia", () => {
    const report = makeOwaspReport();
    const output = cliRenderer.renderOwaspConsole(report, {
      language: "id",
    });

    expect(output).toContain("Ditemukan");
    expect(output).toContain("Injeksi");
  });
});
