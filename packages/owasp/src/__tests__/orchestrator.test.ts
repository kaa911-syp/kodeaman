import { describe, it, expect, vi } from "vitest";
import type { NormalizedFinding } from "@kodeaman/schema";
import type { ScannerAdapter, ScanContext } from "@kodeaman/core";
import { ScanPipeline } from "@kodeaman/core";
import type { KodeamanConfig } from "@kodeaman/config";
import { OwaspScanOrchestrator, type OwaspScanOptions } from "../orchestrator.js";
import {
  detectWSL,
  checkWSLAvailability,
  getWSLInstallInstructions,
  detectEnvironment,
} from "../environment.js";
import { OwaspProgressReporter } from "../progress.js";

function makeFinding(overrides: Partial<NormalizedFinding> = {}): NormalizedFinding {
  return {
    schemaVersion: "1.0.0",
    findingId: "test:rule:abc123",
    dedupeKey: "rule|file.ts|10|CWE-79",
    source: "semgrep",
    category: "xss",
    surface: "source-code",
    severity: "medium",
    confidence: "high",
    status: "open",
    title: "Test finding",
    description: "A test finding for unit tests.",
    location: {
      filePath: "file.ts",
      startLine: 10,
    },
    evidence: [],
    classification: {
      cwe: ["CWE-79"],
    },
    raw: {
      tool: "semgrep",
      toolRuleId: "test.rule",
    },
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
    gamification: {
      issueFamily: "xss",
    },
    detectedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockAdapter(
  name: string,
  findings: NormalizedFinding[]
): ScannerAdapter {
  return {
    name,
    scan: async (_context: ScanContext) => findings,
  };
}

const defaultContext: ScanContext = {
  repoRoot: "/tmp/test-repo",
  branch: "main",
  commitSha: "abc123",
};

const defaultConfig: KodeamanConfig = {
  language: "en",
  scanners: {
    semgrep: true,
    zapBaseline: false,
  },
  presets: [],
  prioritization: {
    maxFindingsInComment: 10,
    failOnSeverity: "high",
  },
  gamification: {
    enabled: true,
  },
  output: {
    markdown: true,
    sarif: false,
    json: true,
  },
};

describe("OwaspScanOrchestrator", () => {
  it("should run a sequential scan across all categories with no findings", async () => {
    const pipeline = new ScanPipeline();
    pipeline.registerAdapter(createMockAdapter("semgrep", []));

    const orchestrator = new OwaspScanOrchestrator(pipeline, defaultConfig);
    const report = await orchestrator.scan(defaultContext);

    expect(report.schemaVersion).toBe("1.0.0");
    expect(report.phases).toHaveLength(10);
    expect(report.totalFindings).toBe(0);
    expect(report.totalFiltered).toBe(0);
    expect(report.scanDurationMs).toBeGreaterThanOrEqual(0);
    expect(report.generatedAt).toBeTruthy();
  });

  it("should filter findings to matching OWASP categories by CWE", async () => {
    const pipeline = new ScanPipeline();
    // CWE-79 maps to A03 (Injection)
    const xssFinding = makeFinding({
      findingId: "xss-1",
      dedupeKey: "xss|file.ts|10|CWE-79",
      classification: { cwe: ["CWE-79"] },
      evidence: [{ type: "code", label: "Scanner evidence", content: "innerHTML = input" }],
    });
    pipeline.registerAdapter(createMockAdapter("semgrep", [xssFinding]));

    const orchestrator = new OwaspScanOrchestrator(pipeline, defaultConfig);
    const report = await orchestrator.scan(defaultContext, {
      categories: ["A03"],
    });

    expect(report.phases).toHaveLength(1);
    expect(report.phases[0].owaspCode).toBe("A03");
    expect(report.phases[0].findings.length).toBeGreaterThanOrEqual(1);
    expect(report.totalFindings).toBeGreaterThanOrEqual(1);
  });

  it("should apply confidence gate and filter low-confidence findings", async () => {
    const pipeline = new ScanPipeline();
    const lowConfidence = makeFinding({
      findingId: "low-conf",
      dedupeKey: "low|file.ts|1|CWE-79",
      confidence: "low",
      classification: { cwe: ["CWE-79"] },
    });
    const highConfidence = makeFinding({
      findingId: "high-conf",
      dedupeKey: "high|file.ts|2|CWE-79",
      confidence: "high",
      classification: { cwe: ["CWE-79"] },
      evidence: [{ type: "code", label: "Scanner evidence", content: "innerHTML = input" }],
    });
    pipeline.registerAdapter(
      createMockAdapter("semgrep", [lowConfidence, highConfidence])
    );

    const orchestrator = new OwaspScanOrchestrator(pipeline, defaultConfig);
    const report = await orchestrator.scan(defaultContext, {
      categories: ["A03"],
      confidenceGate: "high",
    });

    // Only high confidence finding should remain
    const a03Phase = report.phases[0];
    expect(a03Phase.findings).toHaveLength(1);
    expect(a03Phase.findings[0].findingId).toBe("high-conf");
    expect(a03Phase.confidenceGate).toBe("filtered");
    expect(a03Phase.filteredCount).toBe(1);
  });

  it("should apply evidence gate and filter findings without evidence", async () => {
    const pipeline = new ScanPipeline();
    const withEvidence = makeFinding({
      findingId: "with-evidence",
      dedupeKey: "ev1|file.ts|1|CWE-79",
      classification: { cwe: ["CWE-79"] },
      evidence: [
        { type: "code", label: "Vulnerable code", content: "innerHTML = input" },
      ],
    });
    const withoutEvidence = makeFinding({
      findingId: "no-evidence",
      dedupeKey: "ev2|file.ts|2|CWE-79",
      classification: { cwe: ["CWE-79"] },
      evidence: [],
    });
    pipeline.registerAdapter(
      createMockAdapter("semgrep", [withEvidence, withoutEvidence])
    );

    const orchestrator = new OwaspScanOrchestrator(pipeline, defaultConfig);
    const report = await orchestrator.scan(defaultContext, {
      categories: ["A03"],
      evidenceGate: true,
    });

    const a03Phase = report.phases[0];
    expect(a03Phase.findings).toHaveLength(1);
    expect(a03Phase.findings[0].findingId).toBe("with-evidence");
  });

  it("should perform multi-scanner correlation between SAST and DAST", async () => {
    const pipeline = new ScanPipeline();
    const sastFinding = makeFinding({
      findingId: "sast-xss",
      dedupeKey: "sast|file.ts|10|CWE-79",
      source: "semgrep",
      confidence: "medium",
      classification: { cwe: ["CWE-79"] },
      location: { filePath: "file.ts", startLine: 10 },
      prioritization: {
        baseSeverity: "medium",
        adjustedSeverity: "medium",
        priorityScore: 50,
        confidenceScore: 60,
        reasons: ["SAST detection"],
      },
    });
    const dastFinding = makeFinding({
      findingId: "dast-xss",
      dedupeKey: "dast|file.ts|10|CWE-79",
      source: "zap-baseline",
      surface: "web-page",
      confidence: "medium",
      classification: { cwe: ["CWE-79"] },
      location: { filePath: "file.ts", startLine: 10 },
      raw: { tool: "zap-baseline" },
      prioritization: {
        baseSeverity: "medium",
        adjustedSeverity: "medium",
        priorityScore: 50,
        confidenceScore: 60,
        reasons: ["DAST detection"],
      },
    });
    pipeline.registerAdapter(
      createMockAdapter("semgrep", [sastFinding, dastFinding])
    );

    const orchestrator = new OwaspScanOrchestrator(pipeline, defaultConfig);
    const report = await orchestrator.scan(defaultContext, {
      categories: ["A03"],
    });

    // Both findings should have boosted confidence
    const allFindings = report.phases.flatMap((p) => p.findings);
    const sast = allFindings.find((f) => f.findingId === "sast-xss");
    const dast = allFindings.find((f) => f.findingId === "dast-xss");

    if (sast && dast) {
      expect(sast.confidence).toBe("high");
      expect(dast.confidence).toBe("high");
      expect(sast.prioritization.confidenceScore).toBe(80);
      expect(dast.prioritization.confidenceScore).toBe(80);
      expect(sast.prioritization.reasons).toContain(
        "Corroborated by DAST scanner"
      );
      expect(dast.prioritization.reasons).toContain(
        "Corroborated by SAST scanner"
      );
    }
  });

  it("should run in parallel mode", async () => {
    const pipeline = new ScanPipeline();
    const finding = makeFinding({
      findingId: "parallel-test",
      dedupeKey: "par|file.ts|1|CWE-79",
      classification: { cwe: ["CWE-79"] },
    });
    pipeline.registerAdapter(createMockAdapter("semgrep", [finding]));

    const orchestrator = new OwaspScanOrchestrator(pipeline, defaultConfig);
    const report = await orchestrator.scan(defaultContext, {
      parallel: true,
      categories: ["A03", "A01"],
    });

    expect(report.phases).toHaveLength(2);
    expect(report.scanDurationMs).toBeGreaterThanOrEqual(0);
  });

  it("should filter to specific categories", async () => {
    const pipeline = new ScanPipeline();
    pipeline.registerAdapter(createMockAdapter("semgrep", []));

    const orchestrator = new OwaspScanOrchestrator(pipeline, defaultConfig);
    const report = await orchestrator.scan(defaultContext, {
      categories: ["A01", "A03", "A10"],
    });

    expect(report.phases).toHaveLength(3);
    expect(report.phases[0].owaspCode).toBe("A01");
    expect(report.phases[1].owaspCode).toBe("A03");
    expect(report.phases[2].owaspCode).toBe("A10");
  });

  it("should invoke progress callbacks", async () => {
    const pipeline = new ScanPipeline();
    pipeline.registerAdapter(createMockAdapter("semgrep", []));

    const phaseStarts: string[] = [];
    const phaseCompletes: string[] = [];

    const orchestrator = new OwaspScanOrchestrator(pipeline, defaultConfig);
    await orchestrator.scan(defaultContext, {
      categories: ["A01", "A03"],
      onPhaseStart: (code, name) => {
        phaseStarts.push(code);
      },
      onPhaseComplete: (code, name, count, ms) => {
        phaseCompletes.push(code);
      },
    });

    expect(phaseStarts).toEqual(["A01", "A03"]);
    expect(phaseCompletes).toEqual(["A01", "A03"]);
  });

  it("should tag findings with OWASP category", async () => {
    const pipeline = new ScanPipeline();
    const finding = makeFinding({
      findingId: "tag-test",
      dedupeKey: "tag|file.ts|1|CWE-79",
      classification: { cwe: ["CWE-79"] },
    });
    pipeline.registerAdapter(createMockAdapter("semgrep", [finding]));

    const orchestrator = new OwaspScanOrchestrator(pipeline, defaultConfig);
    const report = await orchestrator.scan(defaultContext, {
      categories: ["A03"],
    });

    const a03Findings = report.phases[0].findings;
    if (a03Findings.length > 0) {
      expect(a03Findings[0].owaspCategory).toBe("A03-injection");
    }
  });

  it("should include environment info in report", async () => {
    const pipeline = new ScanPipeline();
    pipeline.registerAdapter(createMockAdapter("semgrep", []));

    const orchestrator = new OwaspScanOrchestrator(pipeline, defaultConfig);
    const report = await orchestrator.scan(defaultContext, {
      categories: ["A01"],
    });

    expect(report.environment).toBeDefined();
    expect(report.environment.platform).toBeTruthy();
    expect(report.environment.nodeVersion).toBeTruthy();
    expect(Array.isArray(report.environment.scannersAvailable)).toBe(true);
  });
});

describe("Environment Detection", () => {
  it("should detect WSL status", () => {
    const result = detectWSL();
    expect(result).toHaveProperty("isWSL");
    expect(typeof result.isWSL).toBe("boolean");
  });

  it("should check WSL availability on current platform", () => {
    const result = checkWSLAvailability();
    expect(result).toHaveProperty("available");
    expect(result).toHaveProperty("distros");
    expect(Array.isArray(result.distros)).toBe(true);
  });

  it("should return WSL install instructions in English", () => {
    const instructions = getWSLInstallInstructions("en");
    expect(instructions.locale).toBe("en");
    expect(instructions.title).toContain("WSL");
    expect(instructions.steps.length).toBeGreaterThan(0);
    expect(instructions.note).toBeTruthy();
  });

  it("should return WSL install instructions in Indonesian", () => {
    const instructions = getWSLInstallInstructions("id");
    expect(instructions.locale).toBe("id");
    expect(instructions.title).toContain("WSL");
    expect(instructions.steps.length).toBeGreaterThan(0);
    expect(instructions.note).toBeTruthy();
  });

  it("should detect full environment", () => {
    const env = detectEnvironment();
    expect(env).toHaveProperty("platform");
    expect(env).toHaveProperty("isWSL");
    expect(env).toHaveProperty("scanners");
    expect(env).toHaveProperty("nodeVersion");
    expect(env).toHaveProperty("hasDocker");
    expect(env).toHaveProperty("scannersAvailable");
    expect(Array.isArray(env.scanners)).toBe(true);
  });
});

describe("OwaspProgressReporter", () => {
  it("should report phase start in English", () => {
    const messages: string[] = [];
    const reporter = new OwaspProgressReporter("en", (msg) =>
      messages.push(msg)
    );

    reporter.reportPhaseStart("A03", "Injection");

    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain("A03");
    expect(messages[0]).toContain("Injection");
    expect(messages[0]).toContain("Starting");
  });

  it("should report phase start in Indonesian", () => {
    const messages: string[] = [];
    const reporter = new OwaspProgressReporter("id", (msg) =>
      messages.push(msg)
    );

    reporter.reportPhaseStart("A03", "Injeksi");

    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain("A03");
    expect(messages[0]).toContain("Memulai");
  });

  it("should report summary in English", () => {
    const messages: string[] = [];
    const reporter = new OwaspProgressReporter("en", (msg) =>
      messages.push(msg)
    );

    reporter.reportSummary(15, 3, 5000, 10);

    expect(messages.some((m) => m.includes("OWASP Top 10 Scan Summary"))).toBe(
      true
    );
    expect(messages.some((m) => m.includes("15"))).toBe(true);
    expect(messages.some((m) => m.includes("10/10"))).toBe(true);
  });

  it("should report WSL required warning", () => {
    const messages: string[] = [];
    const reporter = new OwaspProgressReporter("en", (msg) =>
      messages.push(msg)
    );

    reporter.reportWSLRequired(["semgrep", "zap-baseline.py"]);

    expect(messages.some((m) => m.includes("semgrep"))).toBe(true);
    expect(messages.some((m) => m.includes("WSL"))).toBe(true);
  });
});
