import { describe, it, expect } from "vitest";
import { SemgrepAdapter } from "../adapter.js";
import {
  mapSeverity,
  mapConfidence,
  mapCategory,
  generateDedupeKey,
  generateFindingId,
} from "../mapper.js";
import type { SemgrepRawOutput } from "../types.js";
import semgrepFixture from "./fixtures/semgrep-output.json" with { type: "json" };

describe("SemgrepAdapter", () => {
  const adapter = new SemgrepAdapter();

  describe("parseSemgrepOutput", () => {
    it("should parse all non-ignored results from semgrep JSON output", () => {
      const findings = adapter.parseSemgrepOutput(semgrepFixture as SemgrepRawOutput);

      expect(findings).toHaveLength(4);
      expect(findings.every((f) => f.source === "semgrep")).toBe(true);
      expect(findings.every((f) => f.schemaVersion === "1.0.0")).toBe(true);
      expect(findings.every((f) => f.status === "open")).toBe(true);
    });

    it("should correctly map SQL injection finding", () => {
      const findings = adapter.parseSemgrepOutput(semgrepFixture as SemgrepRawOutput);
      const sqli = findings.find((f) => f.category === "sqli");

      expect(sqli).toBeDefined();
      expect(sqli!.severity).toBe("high");
      expect(sqli!.confidence).toBe("high");
      expect(sqli!.location.filePath).toBe("app/views/users.py");
      expect(sqli!.location.startLine).toBe(42);
      expect(sqli!.classification.cwe).toContain(
        "CWE-89: Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection')",
      );
      expect(sqli!.raw.toolRuleId).toBe(
        "python.django.security.injection.sql.sql-injection-using-raw",
      );
    });

    it("should correctly map XSS finding", () => {
      const findings = adapter.parseSemgrepOutput(semgrepFixture as SemgrepRawOutput);
      const xss = findings.find((f) => f.category === "xss");

      expect(xss).toBeDefined();
      expect(xss!.severity).toBe("medium");
      expect(xss!.confidence).toBe("medium");
      expect(xss!.location.filePath).toBe("frontend/src/components/Chat.tsx");
    });

    it("should correctly map hardcoded secret finding", () => {
      const findings = adapter.parseSemgrepOutput(semgrepFixture as SemgrepRawOutput);
      const secrets = findings.find((f) => f.category === "secrets");

      expect(secrets).toBeDefined();
      expect(secrets!.severity).toBe("high");
      expect(secrets!.location.filePath).toBe("app/config/settings.py");
      expect(secrets!.location.snippet).toContain("super_secret_password_123");
    });

    it("should correctly map debug mode finding", () => {
      const findings = adapter.parseSemgrepOutput(semgrepFixture as SemgrepRawOutput);
      const debug = findings.find((f) =>
        f.raw.toolRuleId?.includes("debug-enabled"),
      );

      expect(debug).toBeDefined();
      expect(debug!.severity).toBe("medium");
      expect(debug!.confidence).toBe("high");
    });

    it("should filter out ignored results", () => {
      const rawWithIgnored: SemgrepRawOutput = {
        results: [
          {
            ...semgrepFixture.results[0],
            extra: { ...semgrepFixture.results[0].extra, is_ignored: true },
          },
        ],
        errors: [],
      };

      const findings = adapter.parseSemgrepOutput(rawWithIgnored);
      expect(findings).toHaveLength(0);
    });

    it("should generate unique finding IDs", () => {
      const findings = adapter.parseSemgrepOutput(semgrepFixture as SemgrepRawOutput);
      const ids = findings.map((f) => f.findingId);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should generate unique dedupe keys", () => {
      const findings = adapter.parseSemgrepOutput(semgrepFixture as SemgrepRawOutput);
      const keys = findings.map((f) => f.dedupeKey);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });

    it("should populate evidence blocks", () => {
      const findings = adapter.parseSemgrepOutput(semgrepFixture as SemgrepRawOutput);
      for (const finding of findings) {
        expect(finding.evidence.length).toBeGreaterThanOrEqual(1);
        expect(finding.evidence[0].type).toBe("code");
      }
    });
  });
});

describe("mapper functions", () => {
  describe("mapSeverity", () => {
    it("should map ERROR to high", () => {
      expect(mapSeverity("ERROR")).toBe("high");
    });

    it("should map WARNING to medium", () => {
      expect(mapSeverity("WARNING")).toBe("medium");
    });

    it("should map INFO to low", () => {
      expect(mapSeverity("INFO")).toBe("low");
    });

    it("should map unknown to info", () => {
      expect(mapSeverity("UNKNOWN")).toBe("info");
    });
  });

  describe("mapConfidence", () => {
    it("should map HIGH confidence", () => {
      expect(mapConfidence({ confidence: "HIGH" })).toBe("high");
    });

    it("should fallback to likelihood", () => {
      expect(mapConfidence({ likelihood: "high" })).toBe("high");
    });

    it("should default to medium", () => {
      expect(mapConfidence({})).toBe("medium");
    });
  });

  describe("mapCategory", () => {
    it("should detect SQL injection from CWE", () => {
      expect(mapCategory({ category: "security", cwe: ["CWE-89"] })).toBe("sqli");
    });

    it("should detect XSS from CWE", () => {
      expect(mapCategory({ category: "security", cwe: ["CWE-79"] })).toBe("xss");
    });

    it("should detect secrets category", () => {
      expect(mapCategory({ category: "secret" })).toBe("secrets");
    });

    it("should default to sast for security category", () => {
      expect(mapCategory({ category: "security" })).toBe("sast");
    });
  });

  describe("generateDedupeKey", () => {
    it("should produce consistent keys for same input", () => {
      const result = semgrepFixture.results[0];
      expect(generateDedupeKey(result)).toBe(generateDedupeKey(result));
    });

    it("should produce different keys for different inputs", () => {
      const key1 = generateDedupeKey(semgrepFixture.results[0]);
      const key2 = generateDedupeKey(semgrepFixture.results[1]);
      expect(key1).not.toBe(key2);
    });
  });

  describe("generateFindingId", () => {
    it("should produce consistent IDs for same input", () => {
      const result = semgrepFixture.results[0];
      expect(generateFindingId(result)).toBe(generateFindingId(result));
    });
  });
});
