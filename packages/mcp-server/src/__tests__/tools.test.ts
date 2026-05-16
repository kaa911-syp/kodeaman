import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the MCP SDK
const mockTool = vi.fn();
const mockServer = { tool: mockTool };

// Import tools after mock setup
import { registerScanTool } from "../tools/scan.js";
import { registerOwaspScanTool } from "../tools/owasp-scan.js";
import { registerPreflightTool } from "../tools/preflight.js";
import { registerListScannersTool } from "../tools/list-scanners.js";
import { registerExplainFindingTool } from "../tools/explain-finding.js";
import { registerSuggestFixTool } from "../tools/suggest-fix.js";
import { registerConvertSarifTool } from "../tools/convert-sarif.js";
import { registerCoverageReportTool } from "../tools/coverage-report.js";

/**
 * Helper to extract the handler function after registering a single tool.
 * Clears the mock before registration so calls[0] always has the right handler.
 */
function getHandler(registerFn: (server: never) => void) {
  mockTool.mockClear();
  registerFn(mockServer as never);
  // server.tool(name, description, schema, handler) — handler is arg index 3
  return mockTool.mock.calls[0][3] as (args: Record<string, unknown>) => Promise<{
    content: { type: string; text: string }[];
    isError?: boolean;
  }>;
}

describe("MCP Server Tool Registration", () => {
  beforeEach(() => {
    mockTool.mockClear();
  });

  it("registers kodeaman_scan tool", () => {
    registerScanTool(mockServer as never);
    expect(mockTool).toHaveBeenCalledOnce();
    expect(mockTool.mock.calls[0][0]).toBe("kodeaman_scan");
    expect(typeof mockTool.mock.calls[0][1]).toBe("string"); // description
    expect(typeof mockTool.mock.calls[0][2]).toBe("object"); // schema
    expect(typeof mockTool.mock.calls[0][3]).toBe("function"); // handler
  });

  it("registers kodeaman_owasp_scan tool", () => {
    registerOwaspScanTool(mockServer as never);
    expect(mockTool).toHaveBeenCalledOnce();
    expect(mockTool.mock.calls[0][0]).toBe("kodeaman_owasp_scan");
  });

  it("registers kodeaman_preflight tool", () => {
    registerPreflightTool(mockServer as never);
    expect(mockTool).toHaveBeenCalledOnce();
    expect(mockTool.mock.calls[0][0]).toBe("kodeaman_preflight");
  });

  it("registers kodeaman_list_scanners tool", () => {
    registerListScannersTool(mockServer as never);
    expect(mockTool).toHaveBeenCalledOnce();
    expect(mockTool.mock.calls[0][0]).toBe("kodeaman_list_scanners");
  });

  it("registers kodeaman_explain_finding tool", () => {
    registerExplainFindingTool(mockServer as never);
    expect(mockTool).toHaveBeenCalledOnce();
    expect(mockTool.mock.calls[0][0]).toBe("kodeaman_explain_finding");
  });

  it("registers kodeaman_suggest_fix tool", () => {
    registerSuggestFixTool(mockServer as never);
    expect(mockTool).toHaveBeenCalledOnce();
    expect(mockTool.mock.calls[0][0]).toBe("kodeaman_suggest_fix");
  });

  it("registers kodeaman_convert_sarif tool", () => {
    registerConvertSarifTool(mockServer as never);
    expect(mockTool).toHaveBeenCalledOnce();
    expect(mockTool.mock.calls[0][0]).toBe("kodeaman_convert_sarif");
  });

  it("registers kodeaman_coverage_report tool", () => {
    registerCoverageReportTool(mockServer as never);
    expect(mockTool).toHaveBeenCalledOnce();
    expect(mockTool.mock.calls[0][0]).toBe("kodeaman_coverage_report");
  });

  it("registers all 8 tools total", () => {
    registerScanTool(mockServer as never);
    registerOwaspScanTool(mockServer as never);
    registerPreflightTool(mockServer as never);
    registerListScannersTool(mockServer as never);
    registerExplainFindingTool(mockServer as never);
    registerSuggestFixTool(mockServer as never);
    registerConvertSarifTool(mockServer as never);
    registerCoverageReportTool(mockServer as never);
    expect(mockTool).toHaveBeenCalledTimes(8);
  });
});

describe("Explain Finding Handler", () => {
  it("extracts coaching content from a finding", async () => {
    const handler = getHandler(registerExplainFindingTool);

    const mockFinding = {
      findingId: "test-001",
      dedupeKey: "test-dedup",
      source: "npm-audit",
      category: "sca",
      surface: "dependency",
      severity: "high",
      confidence: "high",
      status: "open",
      title: "Prototype Pollution in lodash",
      description: "lodash < 4.17.21 is vulnerable to prototype pollution",
      location: { filePath: "package.json", startLine: 10 },
      evidence: [],
      classification: {
        cwe: ["CWE-1321"],
        owasp: ["A06"],
        tags: ["prototype-pollution"],
      },
      raw: { tool: "npm-audit", toolRuleId: "lodash-pp" },
      prioritization: {
        baseSeverity: "high",
        adjustedSeverity: "high",
        priorityScore: 85,
        confidenceScore: 90,
        reasons: ["Known CVE", "Widely used package"],
      },
      coaching: {
        titleEn: "Prototype Pollution in lodash",
        titleId: "Polusi Prototipe di lodash",
        summaryEn: "A prototype pollution vulnerability exists in lodash.",
        summaryId: "Kerentanan polusi prototipe ada di lodash.",
        whyItMattersEn: "Attackers can modify object prototypes.",
        whyItMattersId: "Penyerang dapat memodifikasi prototipe objek.",
        remediationEn: ["Upgrade lodash to >= 4.17.21"],
        remediationId: ["Upgrade lodash ke >= 4.17.21"],
        autofixEligible: true,
        autofixStrategy: "template-rewrite",
      },
      gamification: {
        issueFamily: "sca-outdated",
        xpReward: 50,
        badgeKey: "dependency-defender",
      },
      fixCommands: [
        {
          command: "npm install lodash@latest",
          description: "Update lodash to latest version",
          descriptionId: "Perbarui lodash ke versi terbaru",
          isBreaking: false,
          packageManager: "npm",
        },
      ],
      detectedAt: "2026-01-01T00:00:00Z",
    };

    const result = await handler({
      finding: JSON.stringify(mockFinding),
      language: "en",
    });

    expect(result.isError).toBeUndefined();
    const content = JSON.parse(result.content[0].text);
    expect(content.findingId).toBe("test-001");
    expect(content.title).toBe("Prototype Pollution in lodash");
    expect(content.remediation).toEqual(["Upgrade lodash to >= 4.17.21"]);
    expect(content.autofix.eligible).toBe(true);
    expect(content.fixCommands).toHaveLength(1);
    expect(content.gamification.xpReward).toBe(50);
  });

  it("returns Indonesian content when language is 'id'", async () => {
    const handler = getHandler(registerExplainFindingTool);

    const mockFinding = {
      findingId: "test-002",
      dedupeKey: "test-dedup-2",
      source: "semgrep",
      category: "xss",
      surface: "source-code",
      severity: "medium",
      confidence: "medium",
      status: "open",
      title: "XSS vulnerability",
      description: "Cross-site scripting in template",
      location: { filePath: "views/index.ejs", startLine: 5 },
      evidence: [],
      classification: { cwe: ["CWE-79"] },
      raw: { tool: "semgrep" },
      prioritization: {
        baseSeverity: "medium",
        adjustedSeverity: "medium",
        priorityScore: 60,
        confidenceScore: 70,
        reasons: ["XSS in template"],
      },
      coaching: {
        titleEn: "XSS Vulnerability",
        titleId: "Kerentanan XSS",
        summaryEn: "Cross-site scripting found.",
        summaryId: "Cross-site scripting ditemukan.",
        whyItMattersEn: "Attackers can inject scripts.",
        whyItMattersId: "Penyerang dapat menyuntikkan skrip.",
        remediationEn: ["Use output encoding"],
        remediationId: ["Gunakan encoding output"],
      },
      gamification: { issueFamily: "xss" },
      detectedAt: "2026-01-01T00:00:00Z",
    };

    const result = await handler({
      finding: JSON.stringify(mockFinding),
      language: "id",
    });

    expect(result.isError).toBeUndefined();
    const content = JSON.parse(result.content[0].text);
    expect(content.title).toBe("Kerentanan XSS");
    expect(content.summary).toBe("Cross-site scripting ditemukan.");
    expect(content.remediation).toEqual(["Gunakan encoding output"]);
  });

  it("handles invalid JSON gracefully", async () => {
    const handler = getHandler(registerExplainFindingTool);

    const result = await handler({
      finding: "not valid json",
    });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Failed to explain finding");
  });
});

describe("Suggest Fix Handler", () => {
  it("returns fix commands filtered by package manager", async () => {
    const handler = getHandler(registerSuggestFixTool);

    const mockFinding = {
      findingId: "fix-001",
      dedupeKey: "fix-dedup",
      source: "npm-audit",
      category: "sca",
      surface: "dependency",
      severity: "high",
      confidence: "high",
      status: "open",
      title: "Vulnerable dependency",
      description: "express < 4.18.0 has a vulnerability",
      location: { filePath: "package.json", startLine: 5 },
      evidence: [],
      classification: {},
      raw: { tool: "npm-audit" },
      prioritization: {
        baseSeverity: "high",
        adjustedSeverity: "high",
        priorityScore: 80,
        confidenceScore: 90,
        reasons: [],
      },
      coaching: {
        titleEn: "Vulnerable express",
        titleId: "Express rentan",
        summaryEn: "Update express.",
        summaryId: "Perbarui express.",
        whyItMattersEn: "Security fix.",
        whyItMattersId: "Perbaikan keamanan.",
        remediationEn: ["Update express to >= 4.18.0"],
        remediationId: ["Perbarui express ke >= 4.18.0"],
      },
      gamification: { issueFamily: "sca" },
      fixCommands: [
        {
          command: "npm install express@latest",
          description: "Update express",
          descriptionId: "Perbarui express",
          isBreaking: false,
          packageManager: "npm",
        },
        {
          command: "pnpm add express@latest",
          description: "Update express",
          descriptionId: "Perbarui express",
          isBreaking: false,
          packageManager: "pnpm",
        },
      ],
      detectedAt: "2026-01-01T00:00:00Z",
    };

    const result = await handler({
      finding: JSON.stringify(mockFinding),
      packageManager: "pnpm",
    });

    expect(result.isError).toBeUndefined();
    const content = JSON.parse(result.content[0].text);
    expect(content.hasFixCommands).toBe(true);
    expect(content.fixCommands).toHaveLength(1);
    expect(content.fixCommands[0].command).toBe("pnpm add express@latest");
    expect(content.fixCommands[0].packageManager).toBe("pnpm");
  });
});

describe("Convert SARIF Handler", () => {
  it("converts findings to SARIF format", async () => {
    const handler = getHandler(registerConvertSarifTool);

    const mockFindings = [
      {
        findingId: "sarif-001",
        dedupeKey: "sarif-dedup",
        source: "semgrep",
        category: "xss",
        surface: "source-code",
        severity: "high",
        confidence: "high",
        status: "open",
        title: "XSS Finding",
        description: "A cross-site scripting issue.",
        location: {
          filePath: "src/app.ts",
          startLine: 10,
          endLine: 10,
          startColumn: 1,
          endColumn: 50,
        },
        evidence: [],
        classification: { cwe: ["CWE-79"], tags: ["xss"] },
        raw: { tool: "semgrep", toolRuleId: "javascript.xss.rule" },
        prioritization: {
          baseSeverity: "high",
          adjustedSeverity: "high",
          priorityScore: 85,
          confidenceScore: 90,
          reasons: [],
        },
        coaching: {
          titleEn: "XSS",
          titleId: "XSS",
          summaryEn: "XSS found",
          summaryId: "XSS ditemukan",
          whyItMattersEn: "Scripts can be injected",
          whyItMattersId: "Skrip dapat disuntikkan",
          remediationEn: ["Escape output"],
          remediationId: ["Escape output"],
        },
        gamification: { issueFamily: "xss" },
        detectedAt: "2026-01-01T00:00:00Z",
      },
    ];

    const result = await handler({
      findings: JSON.stringify(mockFindings),
    });

    expect(result.isError).toBeUndefined();
    const sarif = JSON.parse(result.content[0].text);
    expect(sarif.version).toBe("2.1.0");
    expect(sarif.$schema).toContain("sarif");
    expect(sarif.runs).toHaveLength(1);
    expect(sarif.runs[0].results).toHaveLength(1);
    expect(sarif.runs[0].tool.driver.name).toBe("kodeaman");
  });
});
