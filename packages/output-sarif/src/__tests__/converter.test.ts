import { describe, expect, it } from "vitest";
import type { NormalizedFinding } from "@aspidasec/schema";
import { SarifConverter } from "../converter.js";

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
      startColumn: 10,
      snippet: "$query = \"SELECT * FROM users WHERE id = $id\";",
    },
    evidence: [],
    classification: {
      cwe: ["CWE-89"],
      owasp: ["A03:2021"],
      tags: ["injection"],
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
      remediationEn: ["Use parameterized queries"],
      remediationId: ["Gunakan parameterized queries"],
    },
    gamification: {
      issueFamily: "injection",
    },
    detectedAt: "2026-01-15T10:00:00Z",
    ...overrides,
  };
}

describe("SarifConverter", () => {
  const converter = new SarifConverter();

  it("converts findings to SARIF v2.1.0", () => {
    const sarif = converter.convert([makeFinding()]);

    expect(sarif.version).toBe("2.1.0");
    expect(sarif.runs).toHaveLength(1);
    expect(sarif.runs[0].tool.driver.name).toBe("aspidasec");
    expect(sarif.runs[0].results).toHaveLength(1);
  });

  it("maps severity levels to SARIF levels", () => {
    const sarif = converter.convert([
      makeFinding({ findingId: "critical", dedupeKey: "critical", severity: "critical" }),
      makeFinding({ findingId: "high", dedupeKey: "high", severity: "high" }),
      makeFinding({ findingId: "medium", dedupeKey: "medium", severity: "medium" }),
      makeFinding({ findingId: "low", dedupeKey: "low", severity: "low" }),
      makeFinding({ findingId: "info", dedupeKey: "info", severity: "info" }),
    ]);

    expect(sarif.runs[0].results.map((result) => result.level)).toEqual([
      "error",
      "error",
      "warning",
      "note",
      "note",
    ]);
  });

  it("uses raw tool rule ids and dedupe keys", () => {
    const sarif = converter.convert([makeFinding()]);
    const result = sarif.runs[0].results[0];

    expect(result.ruleId).toBe("php.lang.security.injection.tainted-sql-string");
    expect(result.partialFingerprints?.dedupeKey).toBe("test-dedupe-001");
  });

  it("groups unique rules with CWE tags", () => {
    const sarif = converter.convert([
      makeFinding({ findingId: "one", dedupeKey: "one" }),
      makeFinding({ findingId: "two", dedupeKey: "two" }),
      makeFinding({
        findingId: "three",
        dedupeKey: "three",
        raw: { tool: "semgrep", toolRuleId: "different-rule" },
        classification: { cwe: ["CWE-79"] },
      }),
    ]);

    const rules = sarif.runs[0].tool.driver.rules;
    expect(rules).toHaveLength(2);
    expect(rules[0].properties?.tags).toContain("CWE-89");
    expect(rules[0].properties?.tags).toContain("injection");
    expect(rules[1].properties?.tags).toContain("CWE-79");
  });

  it("maps file, region, snippet, and web metadata into locations", () => {
    const sarif = converter.convert([
      makeFinding({
        location: {
          filePath: "src/routes/user.ts",
          startLine: 12,
          endLine: 14,
          startColumn: 3,
          endColumn: 20,
          snippet: "req.query.id",
          url: "https://example.test/users?id=1",
          httpMethod: "GET",
          parameter: "id",
        },
      }),
    ]);

    const location = sarif.runs[0].results[0].locations[0];
    expect(location.physicalLocation?.artifactLocation?.uri).toBe("src/routes/user.ts");
    expect(location.physicalLocation?.region?.startLine).toBe(12);
    expect(location.physicalLocation?.region?.snippet?.text).toBe("req.query.id");
    expect(location.properties?.url).toBe("https://example.test/users?id=1");
    expect(location.properties?.parameter).toBe("id");
  });
});
