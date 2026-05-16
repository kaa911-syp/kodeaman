import { describe, it, expect } from "vitest";
import { GamificationEngine, type FindingHistory } from "../engine.js";
import type { NormalizedFinding } from "@kodeaman/schema";

function makeFinding(overrides: Partial<NormalizedFinding> = {}): NormalizedFinding {
  return {
    schemaVersion: "1.0.0",
    findingId: "test-001",
    dedupeKey: "test-dedup-001",
    source: "semgrep",
    category: "sqli",
    surface: "source-code",
    severity: "high",
    confidence: "high",
    status: "open",
    title: "SQL Injection in query",
    description: "User input concatenated into SQL query",
    location: { filePath: "app/Models/User.php", startLine: 42 },
    evidence: [],
    classification: { cwe: ["CWE-89"] },
    raw: { tool: "semgrep", toolRuleId: "php.laravel.security.raw-sql-injection" },
    prioritization: {
      baseSeverity: "high",
      adjustedSeverity: "high",
      priorityScore: 85,
      confidenceScore: 90,
      reasons: ["Direct SQL concatenation detected"],
    },
    coaching: {
      titleEn: "",
      titleId: "",
      summaryEn: "",
      summaryId: "",
      whyItMattersEn: "",
      whyItMattersId: "",
      remediationEn: [],
      remediationId: [],
    },
    gamification: {
      issueFamily: "sqli",
    },
    detectedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("GamificationEngine", () => {
  const engine = new GamificationEngine();

  describe("calculateXpReward", () => {
    it("returns 25 XP for critical severity", () => {
      expect(engine.calculateXpReward("critical", "sqli")).toBe(25);
    });

    it("returns 15 XP for high severity", () => {
      expect(engine.calculateXpReward("high", "xss")).toBe(15);
    });

    it("returns 10 XP for medium severity", () => {
      expect(engine.calculateXpReward("medium", "csrf")).toBe(10);
    });

    it("returns 5 XP for low severity", () => {
      expect(engine.calculateXpReward("low", "config")).toBe(5);
    });

    it("returns 1 XP for info severity", () => {
      expect(engine.calculateXpReward("info", "other")).toBe(1);
    });
  });

  describe("checkBadgeEligibility", () => {
    it("returns first-fix when no history provided", () => {
      const finding = makeFinding();
      const badge = engine.checkBadgeEligibility(finding);
      expect(badge).toBe("first-fix");
    });

    it("returns first-fix when totalFixed is 0", () => {
      const finding = makeFinding();
      const history: FindingHistory = {
        totalFixed: 0,
        fixedByCategory: {},
        consecutiveCleanPrs: 0,
        totalXp: 0,
      };
      expect(engine.checkBadgeEligibility(finding, history)).toBe("first-fix");
    });

    it("returns first-sqli-fix for first SQL injection fix", () => {
      const finding = makeFinding({ category: "sqli" });
      const history: FindingHistory = {
        totalFixed: 5,
        fixedByCategory: { xss: 3 },
        consecutiveCleanPrs: 0,
        totalXp: 50,
      };
      expect(engine.checkBadgeEligibility(finding, history)).toBe("first-sqli-fix");
    });

    it("returns first-xss-fix for first XSS fix", () => {
      const finding = makeFinding({ category: "xss" });
      const history: FindingHistory = {
        totalFixed: 5,
        fixedByCategory: { sqli: 2 },
        consecutiveCleanPrs: 0,
        totalXp: 50,
      };
      expect(engine.checkBadgeEligibility(finding, history)).toBe("first-xss-fix");
    });

    it("returns streak-3 for 3 consecutive clean PRs", () => {
      const finding = makeFinding({ category: "config" });
      const history: FindingHistory = {
        totalFixed: 10,
        fixedByCategory: { config: 5, sqli: 3, xss: 2 },
        consecutiveCleanPrs: 3,
        totalXp: 50,
      };
      expect(engine.checkBadgeEligibility(finding, history)).toBe("streak-3");
    });

    it("returns streak-7 for 7 consecutive clean PRs", () => {
      const finding = makeFinding({ category: "config" });
      const history: FindingHistory = {
        totalFixed: 20,
        fixedByCategory: { config: 10, sqli: 5, xss: 5 },
        consecutiveCleanPrs: 7,
        totalXp: 50,
      };
      expect(engine.checkBadgeEligibility(finding, history)).toBe("streak-7");
    });

    it("returns security-champion when crossing 100 XP", () => {
      const finding = makeFinding({ severity: "high", category: "config" });
      const history: FindingHistory = {
        totalFixed: 10,
        fixedByCategory: { config: 5, sqli: 3, xss: 2 },
        consecutiveCleanPrs: 0,
        totalXp: 90,
      };
      expect(engine.checkBadgeEligibility(finding, history)).toBe("security-champion");
    });
  });

  describe("isRepeatOffender", () => {
    it("returns false with no history", () => {
      const finding = makeFinding();
      expect(engine.isRepeatOffender(finding)).toBe(false);
    });

    it("returns false with fewer than 3 fixes in category", () => {
      const finding = makeFinding({ category: "sqli" });
      const history: FindingHistory = {
        totalFixed: 5,
        fixedByCategory: { sqli: 2 },
        consecutiveCleanPrs: 0,
        totalXp: 30,
      };
      expect(engine.isRepeatOffender(finding, history)).toBe(false);
    });

    it("returns true with 3+ fixes in same category", () => {
      const finding = makeFinding({ category: "sqli" });
      const history: FindingHistory = {
        totalFixed: 10,
        fixedByCategory: { sqli: 4 },
        consecutiveCleanPrs: 0,
        totalXp: 60,
      };
      expect(engine.isRepeatOffender(finding, history)).toBe(true);
    });
  });

  describe("applyGamification", () => {
    it("returns complete gamification metadata", () => {
      const finding = makeFinding();
      const result = engine.applyGamification(finding);

      expect(result.issueFamily).toBe("sqli");
      expect(result.xpReward).toBe(15);
      expect(result.badgeKey).toBe("first-fix");
      expect(result.repeatOffender).toBe(false);
    });

    it("includes quest progress for matching category", () => {
      const finding = makeFinding({ category: "sqli" });
      const result = engine.applyGamification(finding);

      expect(result.questKey).toBe("quest-fix-3-injection-issues");
      expect(result.questProgressDelta).toBe(1);
    });

    it("includes quest progress for XSS category", () => {
      const finding = makeFinding({ category: "xss" });
      const result = engine.applyGamification(finding);

      expect(result.questKey).toBe("quest-fix-5-xss-issues");
      expect(result.questProgressDelta).toBe(1);
    });
  });

  describe("checkQuestProgress", () => {
    it("returns progress for matching quest category", () => {
      const finding = makeFinding({ category: "sqli" });
      const quest = {
        key: "quest-fix-3-injection-issues",
        nameEn: "Injection Hunter",
        nameId: "Pemburu Injection",
        descriptionEn: "Fix 3 injection issues",
        descriptionId: "Perbaiki 3 masalah injection",
        targetCount: 3,
        category: "sqli",
        rewardXp: 50,
      };
      const result = engine.checkQuestProgress(finding, quest);
      expect(result.questKey).toBe("quest-fix-3-injection-issues");
      expect(result.progressDelta).toBe(1);
    });

    it("returns 0 progress for non-matching category", () => {
      const finding = makeFinding({ category: "xss" });
      const quest = {
        key: "quest-fix-3-injection-issues",
        nameEn: "Injection Hunter",
        nameId: "Pemburu Injection",
        descriptionEn: "Fix 3 injection issues",
        descriptionId: "Perbaiki 3 masalah injection",
        targetCount: 3,
        category: "sqli",
        rewardXp: 50,
      };
      const result = engine.checkQuestProgress(finding, quest);
      expect(result.progressDelta).toBe(0);
    });
  });
});
