import { describe, expect, it } from "vitest";
import type { NormalizedFinding } from "@aspidasec/schema";
import { buildCoverageReport } from "../coverage.js";
import type { ScannerCoverage } from "../types.js";

function makeFinding(source: string): NormalizedFinding {
  return {
    schemaVersion: "1.0.0",
    findingId: `${source}:rule:abc123`,
    dedupeKey: `${source}|file.ts|10|CWE-79`,
    source,
    category: "xss",
    surface: source === "zap-baseline" ? "web-page" : "source-code",
    severity: "medium",
    confidence: "high",
    status: "open",
    title: "Test finding",
    description: "A test finding for unit tests.",
    location: { filePath: "file.ts", startLine: 10 },
    evidence: [],
    classification: { cwe: ["CWE-79"] },
    raw: { tool: source, toolRuleId: "test.rule" },
    prioritization: {
      baseSeverity: "medium",
      adjustedSeverity: "medium",
      priorityScore: 50,
      confidenceScore: 80,
      reasons: ["Test reason"],
    },
    coaching: {
      titleEn: "Fix this",
      titleId: "Perbaiki ini",
      summaryEn: "Summary",
      summaryId: "Ringkasan",
      whyItMattersEn: "It matters",
      whyItMattersId: "Ini penting",
      remediationEn: ["Fix it"],
      remediationId: ["Perbaiki"],
    },
    gamification: { issueFamily: "xss" },
    detectedAt: new Date().toISOString(),
  };
}

describe("buildCoverageReport", () => {
  it("reports scanners that ran, skipped scanners, OWASP coverage, and surfaces", () => {
    const scanners: ScannerCoverage[] = [
      { scannerName: "semgrep", status: "ran", findingsCount: 1, durationMs: 12 },
      {
        scannerName: "zap-baseline",
        status: "skipped-disabled",
        reason: "Disabled in configuration",
        findingsCount: 0,
        durationMs: 0,
      },
      { scannerName: "npm-audit", status: "ran", findingsCount: 1, durationMs: 8 },
    ];

    const report = buildCoverageReport(scanners, [makeFinding("semgrep"), makeFinding("npm-audit")]);

    expect(report.scannersConfigured).toEqual(["semgrep", "zap-baseline", "npm-audit"]);
    expect(report.scannersRan).toEqual(["semgrep", "npm-audit"]);
    expect(report.scannersSkipped).toEqual([
      { name: "zap-baseline", reason: "Disabled in configuration" },
    ]);
    expect(report.owaspCoverage.find((category) => category.categoryId === "A01")?.covered).toBe(true);
    expect(report.owaspCoverage.find((category) => category.categoryId === "A04")?.covered).toBe(false);
    expect(report.owaspCoverage.find((category) => category.categoryId === "A06")?.coveredBy).toEqual(["npm-audit"]);
    expect(report.overallCoveragePercent).toBe(70);
    expect(report.scanSurfaces).toContainEqual({
      surface: "dependency",
      covered: true,
      scanners: ["npm-audit"],
    });
  });
});
