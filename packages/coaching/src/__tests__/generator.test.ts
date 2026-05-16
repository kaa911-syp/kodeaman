import { describe, it, expect } from "vitest";
import { CoachingGenerator } from "../generator.js";
import { coachingTemplates, getTemplateByKey, getTemplatesByCategory } from "../templates.js";
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
    gamification: { issueFamily: "sqli" },
    detectedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("CoachingGenerator", () => {
  const generator = new CoachingGenerator();

  it("generates coaching content for a SQL injection finding", () => {
    const finding = makeFinding();
    const content = generator.generate(finding, "en");

    expect(content.titleEn).toBe("Laravel Raw Query SQL Injection");
    expect(content.titleId).toBe("SQL Injection pada Raw Query Laravel");
    expect(content.summaryEn).toBeTruthy();
    expect(content.summaryId).toBeTruthy();
    expect(content.whyItMattersEn).toBeTruthy();
    expect(content.whyItMattersId).toBeTruthy();
    expect(content.remediationEn.length).toBeGreaterThan(0);
    expect(content.remediationId.length).toBeGreaterThan(0);
  });

  it("matches by ruleId first, then falls back to category", () => {
    const findingWithRule = makeFinding({
      raw: { tool: "semgrep", toolRuleId: "php.laravel.security.raw-sql-injection" },
    });
    const content = generator.generate(findingWithRule, "en");
    expect(content.titleEn).toBe("Laravel Raw Query SQL Injection");

    const findingNoRule = makeFinding({
      raw: { tool: "semgrep" },
    });
    const contentFallback = generator.generate(findingNoRule, "en");
    expect(contentFallback.titleEn).toBe("SQL Injection Detected");
  });

  it("includes lesson metadata when template has lessonId", () => {
    const finding = makeFinding();
    const content = generator.generate(finding, "en");

    expect(content.lessonId).toBe("sqli-001");
    expect(content.lessonSlug).toBe("sql-injection-basics");
    expect(content.lessonLevel).toBe("beginner");
    expect(content.lessonEstimatedMinutes).toBe(5);
  });

  it("generates fallback content for unknown categories", () => {
    const finding = makeFinding({
      category: "other",
      raw: { tool: "custom" },
    });
    const content = generator.generate(finding, "en");

    expect(content.titleEn).toContain("Security Issue");
    expect(content.autofixEligible).toBe(false);
    expect(content.autofixStrategy).toBe("none");
  });

  it("generates coaching for XSS findings", () => {
    const finding = makeFinding({
      category: "xss",
      raw: { tool: "semgrep" },
    });
    const content = generator.generate(finding, "en");

    expect(content.titleEn).toBe("Cross-Site Scripting (XSS) Detected");
    expect(content.lessonId).toBe("xss-001");
  });

  it("generates coaching for CSRF findings", () => {
    const finding = makeFinding({
      category: "csrf",
      raw: { tool: "semgrep" },
    });
    const content = generator.generate(finding, "en");

    expect(content.titleEn).toBe("Missing CSRF Protection");
    expect(content.lessonId).toBe("csrf-001");
  });

  it("sets autofix properties from template", () => {
    const finding = makeFinding();
    const content = generator.generate(finding, "en");

    expect(content.autofixEligible).toBe(true);
    expect(content.autofixStrategy).toBe("llm-draft");
  });
});

describe("coachingTemplates", () => {
  it("has exactly 24 templates", () => {
    expect(coachingTemplates).toHaveLength(24);
  });

  it("every template has both en and id content", () => {
    for (const t of coachingTemplates) {
      expect(t.titleEn, `${t.key} missing titleEn`).toBeTruthy();
      expect(t.titleId, `${t.key} missing titleId`).toBeTruthy();
      expect(t.summaryEn, `${t.key} missing summaryEn`).toBeTruthy();
      expect(t.summaryId, `${t.key} missing summaryId`).toBeTruthy();
      expect(t.whyItMattersEn, `${t.key} missing whyItMattersEn`).toBeTruthy();
      expect(t.whyItMattersId, `${t.key} missing whyItMattersId`).toBeTruthy();
      expect(t.remediationEn.length, `${t.key} missing remediationEn`).toBeGreaterThan(0);
      expect(t.remediationId.length, `${t.key} missing remediationId`).toBeGreaterThan(0);
    }
  });

  it("every template has unique key", () => {
    const keys = coachingTemplates.map((t) => t.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("template lookup helpers", () => {
  it("getTemplateByKey finds template", () => {
    const t = getTemplateByKey("sqli");
    expect(t).toBeDefined();
    expect(t?.titleEn).toBe("SQL Injection Detected");
  });

  it("getTemplatesByCategory returns all matching templates", () => {
    const templates = getTemplatesByCategory("sqli");
    expect(templates.length).toBeGreaterThanOrEqual(2);
  });

  it("getTemplateByKey returns undefined for unknown key", () => {
    expect(getTemplateByKey("nonexistent")).toBeUndefined();
  });
});
