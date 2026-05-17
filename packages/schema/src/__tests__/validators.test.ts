import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  NormalizedFindingSchema,
  parseNormalizedFinding,
  safeParseNormalizedFinding,
} from "../index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadFixture(name: string): unknown {
  const filePath = resolve(__dirname, "../examples", name);
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

describe("NormalizedFinding validators", () => {
  describe("sqli-laravel.json fixture", () => {
    it("should parse successfully with parseNormalizedFinding", () => {
      const data = loadFixture("sqli-laravel.json");
      const result = parseNormalizedFinding(data);

      expect(result.schemaVersion).toBe("1.0.0");
      expect(result.findingId).toBe("semgrep:laravel.sql.raw-query:9c0a4e2");
      expect(result.source).toBe("semgrep");
      expect(result.category).toBe("sqli");
      expect(result.severity).toBe("high");
      expect(result.confidence).toBe("high");
      expect(result.status).toBe("open");
    });

    it("should parse successfully with safeParseNormalizedFinding", () => {
      const data = loadFixture("sqli-laravel.json");
      const result = safeParseNormalizedFinding(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Possible SQL injection via raw query");
      }
    });

    it("should validate location fields", () => {
      const data = loadFixture("sqli-laravel.json");
      const result = parseNormalizedFinding(data);

      expect(result.location.filePath).toBe(
        "app/Http/Controllers/UserController.php"
      );
      expect(result.location.startLine).toBe(44);
      expect(result.location.endLine).toBe(44);
      expect(result.location.snippet).toContain("SELECT * FROM users");
    });

    it("should validate evidence array", () => {
      const data = loadFixture("sqli-laravel.json");
      const result = parseNormalizedFinding(data);

      expect(result.evidence).toHaveLength(1);
      expect(result.evidence[0].type).toBe("code");
      expect(result.evidence[0].label).toBe("Matched code");
      expect(result.evidence[0].redacted).toBe(false);
    });

    it("should validate classification refs", () => {
      const data = loadFixture("sqli-laravel.json");
      const result = parseNormalizedFinding(data);

      expect(result.classification.cwe).toContain("CWE-89");
      expect(result.classification.owasp).toContain("A03:2021-Injection");
      expect(result.classification.tags).toContain("laravel");
    });

    it("should validate raw tool refs", () => {
      const data = loadFixture("sqli-laravel.json");
      const result = parseNormalizedFinding(data);

      expect(result.raw.tool).toBe("semgrep");
      expect(result.raw.toolRuleId).toBe("laravel.sql.raw-query");
      expect(result.raw.rawSeverity).toBe("ERROR");
    });

    it("should validate repo context", () => {
      const data = loadFixture("sqli-laravel.json");
      const result = parseNormalizedFinding(data);

      expect(result.repoContext).toBeDefined();
      expect(result.repoContext!.provider).toBe("github");
      expect(result.repoContext!.repoFullName).toBe("aspidasec/demo-laravel");
      expect(result.repoContext!.pullRequestNumber).toBe(18);
      expect(result.repoContext!.framework).toContain("laravel");
    });

    it("should validate prioritization factors", () => {
      const data = loadFixture("sqli-laravel.json");
      const result = parseNormalizedFinding(data);

      expect(result.prioritization.baseSeverity).toBe("high");
      expect(result.prioritization.adjustedSeverity).toBe("high");
      expect(result.prioritization.priorityScore).toBe(86);
      expect(result.prioritization.confidenceScore).toBe(92);
      expect(result.prioritization.reasons).toHaveLength(3);
    });

    it("should validate coaching content with bilingual fields", () => {
      const data = loadFixture("sqli-laravel.json");
      const result = parseNormalizedFinding(data);

      expect(result.coaching.titleEn).toBeTruthy();
      expect(result.coaching.titleId).toBeTruthy();
      expect(result.coaching.summaryEn).toBeTruthy();
      expect(result.coaching.summaryId).toBeTruthy();
      expect(result.coaching.remediationEn).toHaveLength(3);
      expect(result.coaching.remediationId).toHaveLength(3);
      expect(result.coaching.lessonLevel).toBe("beginner");
      expect(result.coaching.autofixEligible).toBe(true);
      expect(result.coaching.autofixStrategy).toBe("template-rewrite");
    });

    it("should validate gamification meta", () => {
      const data = loadFixture("sqli-laravel.json");
      const result = parseNormalizedFinding(data);

      expect(result.gamification.issueFamily).toBe("sqli");
      expect(result.gamification.xpReward).toBe(15);
      expect(result.gamification.badgeKey).toBe("first-sqli-fix");
      expect(result.gamification.streakEligible).toBe(true);
      expect(result.gamification.questKey).toBe(
        "quest-fix-3-injection-issues"
      );
      expect(result.gamification.repeatOffender).toBe(false);
    });

    it("should validate timestamp", () => {
      const data = loadFixture("sqli-laravel.json");
      const result = parseNormalizedFinding(data);

      expect(result.detectedAt).toBe("2026-05-15T16:00:00.000Z");
      expect(result.updatedAt).toBeUndefined();
    });
  });

  describe("validation failures", () => {
    it("should reject empty object", () => {
      const result = safeParseNormalizedFinding({});
      expect(result.success).toBe(false);
    });

    it("should reject invalid schemaVersion", () => {
      const data = loadFixture("sqli-laravel.json") as Record<string, unknown>;
      const result = safeParseNormalizedFinding({
        ...data,
        schemaVersion: "2.0.0",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid source", () => {
      const data = loadFixture("sqli-laravel.json") as Record<string, unknown>;
      const result = safeParseNormalizedFinding({
        ...data,
        source: "not-a-scanner",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid severity", () => {
      const data = loadFixture("sqli-laravel.json") as Record<string, unknown>;
      const result = safeParseNormalizedFinding({
        ...data,
        severity: "extreme",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid category", () => {
      const data = loadFixture("sqli-laravel.json") as Record<string, unknown>;
      const result = safeParseNormalizedFinding({
        ...data,
        category: "not-a-category",
      });
      expect(result.success).toBe(false);
    });

    it("should reject missing required fields", () => {
      const data = loadFixture("sqli-laravel.json") as Record<string, unknown>;
      const { prioritization: _, ...withoutPrioritization } = data;
      const result = safeParseNormalizedFinding(withoutPrioritization);
      expect(result.success).toBe(false);
    });
  });
});
