import { describe, it, expect } from "vitest";
import { ZapBaselineAdapter } from "../adapter.js";
import {
  mapRiskCode,
  mapZapConfidence,
  mapZapCategory,
  generateDedupeKey,
  generateFindingId,
} from "../mapper.js";
import type { ZapRawReport } from "../types.js";
import zapFixture from "./fixtures/zap-baseline-output.json" with { type: "json" };

describe("ZapBaselineAdapter", () => {
  const adapter = new ZapBaselineAdapter();

  describe("parseZapOutput", () => {
    it("should parse all alert instances from ZAP report", () => {
      const findings = adapter.parseZapOutput(zapFixture as unknown as ZapRawReport);

      // 2 instances for missing header + 1 XSS + 1 HSTS + 1 mixed content = 5
      expect(findings).toHaveLength(5);
      expect(findings.every((f) => f.source === "zap-baseline")).toBe(true);
      expect(findings.every((f) => f.schemaVersion === "1.0.0")).toBe(true);
      expect(findings.every((f) => f.status === "open")).toBe(true);
    });

    it("should correctly map XSS finding", () => {
      const findings = adapter.parseZapOutput(zapFixture as unknown as ZapRawReport);
      const xss = findings.find((f) => f.category === "xss");

      expect(xss).toBeDefined();
      expect(xss!.severity).toBe("high");
      expect(xss!.title).toBe("Cross Site Scripting (Reflected)");
      expect(xss!.location.url).toBe("https://example-app.id/search?q=test");
      expect(xss!.location.httpMethod).toBe("GET");
      expect(xss!.location.parameter).toBe("q");
      expect(xss!.classification.cwe).toContain("CWE-79");
    });

    it("should correctly map missing header finding", () => {
      const findings = adapter.parseZapOutput(zapFixture as unknown as ZapRawReport);
      const headerFindings = findings.filter((f) =>
        f.title.includes("X-Content-Type-Options"),
      );

      expect(headerFindings).toHaveLength(2);
      expect(headerFindings[0].severity).toBe("low");
      expect(headerFindings[0].surface).toBe("web-page");
    });

    it("should correctly map HSTS finding", () => {
      const findings = adapter.parseZapOutput(zapFixture as unknown as ZapRawReport);
      const hsts = findings.find((f) =>
        f.title.includes("Strict-Transport-Security"),
      );

      expect(hsts).toBeDefined();
      expect(hsts!.severity).toBe("low");
      expect(hsts!.confidence).toBe("high");
    });

    it("should correctly map mixed content finding", () => {
      const findings = adapter.parseZapOutput(zapFixture as unknown as ZapRawReport);
      const mixed = findings.find((f) =>
        f.title.includes("Mixed Content"),
      );

      expect(mixed).toBeDefined();
      expect(mixed!.severity).toBe("medium");
    });

    it("should populate evidence for XSS attack", () => {
      const findings = adapter.parseZapOutput(zapFixture as unknown as ZapRawReport);
      const xss = findings.find((f) => f.category === "xss");

      expect(xss!.evidence.length).toBeGreaterThanOrEqual(1);
      const attackEvidence = xss!.evidence.find((e) => e.label === "Attack payload");
      expect(attackEvidence).toBeDefined();
      expect(attackEvidence!.content).toContain("alert(1)");
    });

    it("should generate unique finding IDs", () => {
      const findings = adapter.parseZapOutput(zapFixture as unknown as ZapRawReport);
      const ids = findings.map((f) => f.findingId);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should strip HTML from descriptions", () => {
      const findings = adapter.parseZapOutput(zapFixture as unknown as ZapRawReport);
      for (const finding of findings) {
        expect(finding.description).not.toContain("<p>");
        expect(finding.description).not.toContain("</p>");
      }
    });

    it("should set surface to web-page for all DAST findings", () => {
      const findings = adapter.parseZapOutput(zapFixture as unknown as ZapRawReport);
      for (const finding of findings) {
        expect(finding.surface).toBe("web-page");
      }
    });
  });
});

describe("mapper functions", () => {
  describe("mapRiskCode", () => {
    it("should map 3 to high", () => {
      expect(mapRiskCode("3")).toBe("high");
    });

    it("should map 2 to medium", () => {
      expect(mapRiskCode("2")).toBe("medium");
    });

    it("should map 1 to low", () => {
      expect(mapRiskCode("1")).toBe("low");
    });

    it("should map 0 to info", () => {
      expect(mapRiskCode("0")).toBe("info");
    });

    it("should default to info for unknown", () => {
      expect(mapRiskCode("99")).toBe("info");
    });
  });

  describe("mapZapConfidence", () => {
    it("should map 3 to high", () => {
      expect(mapZapConfidence("3")).toBe("high");
    });

    it("should map 2 to medium", () => {
      expect(mapZapConfidence("2")).toBe("medium");
    });

    it("should map 1 to low", () => {
      expect(mapZapConfidence("1")).toBe("low");
    });
  });

  describe("mapZapCategory", () => {
    it("should detect XSS from cweid", () => {
      expect(
        mapZapCategory({ cweid: "79", name: "test" } as any),
      ).toBe("xss");
    });

    it("should detect XSS from name", () => {
      expect(
        mapZapCategory({ cweid: "0", name: "Cross-Site Scripting" } as any),
      ).toBe("xss");
    });

    it("should detect misconfiguration from name", () => {
      expect(
        mapZapCategory({ cweid: "0", name: "Missing Header X-Content-Type-Options" } as any),
      ).toBe("misconfiguration");
    });
  });

  describe("generateDedupeKey", () => {
    it("should produce consistent keys", () => {
      const alert = zapFixture.site[0].alerts[0];
      const instance = alert.instances[0];
      expect(generateDedupeKey(alert as any, instance as any)).toBe(
        generateDedupeKey(alert as any, instance as any),
      );
    });

    it("should produce different keys for different instances", () => {
      const alert = zapFixture.site[0].alerts[0];
      const key1 = generateDedupeKey(alert as any, alert.instances[0] as any);
      const key2 = generateDedupeKey(alert as any, alert.instances[1] as any);
      expect(key1).not.toBe(key2);
    });
  });
});
