import { describe, it, expect } from "vitest";
import { FalsePositiveFilter } from "../false-positive-filter.js";
import type { NormalizedFinding } from "@aspidasec/schema";

function makeFinding(overrides: Partial<NormalizedFinding> = {}): NormalizedFinding {
  return {
    schemaVersion: "1.0.0",
    findingId: `test-${Math.random().toString(36).slice(2, 10)}`,
    dedupeKey: `dedupe-${Math.random().toString(36).slice(2, 10)}`,
    source: "semgrep",
    category: "sast",
    surface: "source-code",
    severity: "medium",
    confidence: "medium",
    status: "open",
    title: "Test finding",
    description: "A test finding",
    location: {
      filePath: "src/app.ts",
      startLine: 10,
      endLine: 10,
    },
    evidence: [
      {
        type: "code",
        label: "Matched code",
        content: "const x = eval(input);",
      },
    ],
    classification: {
      cwe: ["CWE-94"],
      tags: ["test"],
    },
    raw: {
      tool: "semgrep",
      toolRuleId: "javascript.security.eval-injection",
    },
    prioritization: {
      baseSeverity: "medium",
      adjustedSeverity: "medium",
      priorityScore: 50,
      confidenceScore: 60,
      reasons: [],
    },
    coaching: {
      titleEn: "Test",
      titleId: "Tes",
      summaryEn: "Test summary",
      summaryId: "Ringkasan tes",
      whyItMattersEn: "It matters",
      whyItMattersId: "Itu penting",
      remediationEn: ["Fix it"],
      remediationId: ["Perbaiki"],
    },
    gamification: {
      issueFamily: "sast",
    },
    detectedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("FalsePositiveFilter", () => {
  describe("confidence gate", () => {
    it("should pass findings at or above confidence threshold", () => {
      const filter = new FalsePositiveFilter({ confidenceGate: "medium" });
      const findings = [
        makeFinding({ confidence: "high" }),
        makeFinding({ confidence: "medium" }),
      ];

      const result = filter.filter(findings);
      expect(result.findings).toHaveLength(2);
      expect(result.filtered).toHaveLength(0);
    });

    it("should filter findings below confidence threshold", () => {
      const filter = new FalsePositiveFilter({ confidenceGate: "medium" });
      const findings = [
        makeFinding({ confidence: "low" }),
        makeFinding({ confidence: "medium" }),
        makeFinding({ confidence: "high" }),
      ];

      const result = filter.filter(findings);
      expect(result.findings).toHaveLength(2);
      expect(result.filtered).toHaveLength(1);
      expect(result.report.filteredByConfidence).toBe(1);
    });

    it("should use 'low' as default confidence gate (passes everything)", () => {
      const filter = new FalsePositiveFilter();
      const findings = [makeFinding({ confidence: "low" })];

      const result = filter.filter(findings);
      expect(result.findings).toHaveLength(1);
    });
  });

  describe("evidence gate", () => {
    it("should filter findings without evidence when requireEvidence is true", () => {
      const filter = new FalsePositiveFilter({ requireEvidence: true });
      const findings = [
        makeFinding({ evidence: [] }),
        makeFinding({ evidence: [{ type: "code", label: "Match", content: "x" }] }),
      ];

      const result = filter.filter(findings);
      expect(result.findings).toHaveLength(1);
      expect(result.filtered).toHaveLength(1);
      expect(result.report.filteredByEvidence).toBe(1);
    });

    it("should not filter evidence-less findings when requireEvidence is false", () => {
      const filter = new FalsePositiveFilter({ requireEvidence: false });
      const findings = [makeFinding({ evidence: [] })];

      const result = filter.filter(findings);
      expect(result.findings).toHaveLength(1);
    });
  });

  describe("suppression patterns", () => {
    it("should suppress findings matching rule patterns", () => {
      const filter = new FalsePositiveFilter({
        suppressions: [
          { rulePattern: "javascript.security.eval-*", reason: "Known FP in tests" },
        ],
      });
      const findings = [
        makeFinding({ raw: { tool: "semgrep", toolRuleId: "javascript.security.eval-injection" } }),
        makeFinding({ raw: { tool: "semgrep", toolRuleId: "javascript.security.xss-dom" } }),
      ];

      const result = filter.filter(findings);
      expect(result.findings).toHaveLength(1);
      expect(result.filtered).toHaveLength(1);
      expect(result.report.filteredBySuppression).toBe(1);
    });

    it("should suppress findings matching path patterns", () => {
      const filter = new FalsePositiveFilter({
        suppressions: [
          { pathPattern: "test/**", reason: "Test files are not production code" },
        ],
      });
      const findings = [
        makeFinding({ location: { filePath: "test/app.test.ts", startLine: 5 } }),
        makeFinding({ location: { filePath: "src/app.ts", startLine: 10 } }),
      ];

      const result = filter.filter(findings);
      expect(result.findings).toHaveLength(1);
      expect(result.filtered).toHaveLength(1);
    });

    it("should match combined rule and path patterns", () => {
      const filter = new FalsePositiveFilter({
        suppressions: [
          {
            rulePattern: "npm-audit:*",
            pathPattern: "package.json",
            reason: "Suppress all npm audit on root",
          },
        ],
      });
      const findings = [
        makeFinding({
          raw: { tool: "npm-audit", toolRuleId: "npm-audit:1065" },
          location: { filePath: "package.json" },
        }),
        makeFinding({
          raw: { tool: "npm-audit", toolRuleId: "npm-audit:1065" },
          location: { filePath: "packages/core/package.json" },
        }),
      ];

      const result = filter.filter(findings);
      expect(result.findings).toHaveLength(1);
      expect(result.filtered).toHaveLength(1);
    });
  });

  describe("multi-scanner correlation", () => {
    it("should boost confidence when same location found by different scanner types", () => {
      const filter = new FalsePositiveFilter({ multiScannerCorrelation: true });
      const dedupeKey = "same-key";
      const findings = [
        makeFinding({
          source: "semgrep",
          confidence: "low",
          dedupeKey,
          location: { filePath: "src/app.ts", startLine: 42 },
        }),
        makeFinding({
          source: "zap-baseline",
          confidence: "low",
          dedupeKey: "other-key",
          location: { filePath: "src/app.ts", startLine: 42 },
        }),
      ];

      const result = filter.filter(findings);
      // Both should be boosted: SAST (semgrep) and DAST (zap) overlap
      const boostedSemgrep = result.findings.find((f) => f.source === "semgrep");
      const boostedZap = result.findings.find((f) => f.source === "zap-baseline");
      expect(boostedSemgrep!.confidence).toBe("medium");
      expect(boostedZap!.confidence).toBe("medium");
      expect(result.report.correlationBoosts).toBe(2);
    });

    it("should not boost when same scanner type detects same location", () => {
      const filter = new FalsePositiveFilter({ multiScannerCorrelation: true });
      const findings = [
        makeFinding({
          source: "semgrep",
          confidence: "low",
          location: { filePath: "src/app.ts", startLine: 42 },
        }),
        makeFinding({
          source: "semgrep",
          confidence: "low",
          location: { filePath: "src/app.ts", startLine: 42 },
        }),
      ];

      const result = filter.filter(findings);
      expect(result.findings[0].confidence).toBe("low");
      expect(result.report.correlationBoosts).toBe(0);
    });

    it("should not boost findings already at high confidence", () => {
      const filter = new FalsePositiveFilter({ multiScannerCorrelation: true });
      const findings = [
        makeFinding({
          source: "semgrep",
          confidence: "high",
          location: { filePath: "src/app.ts", startLine: 42 },
        }),
        makeFinding({
          source: "zap-baseline",
          confidence: "medium",
          location: { filePath: "src/app.ts", startLine: 42 },
        }),
      ];

      const result = filter.filter(findings);
      const semgrep = result.findings.find((f) => f.source === "semgrep");
      expect(semgrep!.confidence).toBe("high");
    });
  });

  describe("report", () => {
    it("should produce accurate report totals", () => {
      const filter = new FalsePositiveFilter({
        confidenceGate: "medium",
        requireEvidence: true,
        suppressions: [
          { rulePattern: "suppressed-*", reason: "test" },
        ],
      });

      const findings = [
        makeFinding({ confidence: "high" }),
        makeFinding({ confidence: "low" }),
        makeFinding({ confidence: "medium", evidence: [] }),
        makeFinding({
          confidence: "medium",
          raw: { tool: "semgrep", toolRuleId: "suppressed-rule" },
        }),
      ];

      const result = filter.filter(findings);
      expect(result.report.totalInput).toBe(4);
      expect(result.report.totalPassed).toBe(1);
      expect(result.report.totalFiltered).toBe(3);
      expect(result.report.filteredBySuppression).toBe(1);
      expect(result.report.filteredByEvidence).toBe(1);
      expect(result.report.filteredByConfidence).toBe(1);
    });

    it("should handle empty input", () => {
      const filter = new FalsePositiveFilter();
      const result = filter.filter([]);

      expect(result.findings).toHaveLength(0);
      expect(result.filtered).toHaveLength(0);
      expect(result.report.totalInput).toBe(0);
      expect(result.report.totalPassed).toBe(0);
      expect(result.report.totalFiltered).toBe(0);
    });
  });
});
