import { describe, expect, it } from "vitest";
import { PlaywrightAdapter } from "../adapter.js";
import type { CrawlResult } from "../types.js";

class MockCrawler {
  constructor(private readonly result: CrawlResult) {}

  async crawl(): Promise<CrawlResult> {
    return this.result;
  }
}

describe("PlaywrightAdapter", () => {
  it("maps missing headers, CSRF forms, and weak cookies to normalized findings", async () => {
    const adapter = new PlaywrightAdapter(new MockCrawler({
      visitedUrls: ["https://example.test/"],
      securityHeaders: [
        {
          url: "https://example.test/",
          header: "Content-Security-Policy",
          present: false,
          severity: "medium",
          recommendation: "Set a Content-Security-Policy.",
        },
      ],
      forms: [
        {
          url: "https://example.test/login",
          action: "https://example.test/login",
          method: "POST",
          hasCsrfToken: false,
          fieldNames: ["email", "password"],
        },
      ],
      cookies: [
        {
          url: "https://example.test/",
          name: "session",
          httpOnly: false,
          secure: false,
        },
      ],
    }) as never);

    const findings = await adapter.scan({ targetUrl: "https://example.test/" });

    expect(findings).toHaveLength(5);
    expect(findings.every((finding) => finding.source === "playwright")).toBe(true);
    expect(findings.map((finding) => finding.raw.toolRuleId)).toContain("missing-content-security-policy");
    expect(findings.map((finding) => finding.raw.toolRuleId)).toContain("form-missing-csrf-token");
    expect(findings.map((finding) => finding.raw.toolRuleId)).toContain("cookie-missing-httponly");
    expect(findings.map((finding) => finding.raw.toolRuleId)).toContain("cookie-missing-secure");
  });

  it("does not report GET forms or cookies with defensive attributes", async () => {
    const adapter = new PlaywrightAdapter(new MockCrawler({
      visitedUrls: ["https://example.test/"],
      securityHeaders: [],
      forms: [
        {
          url: "https://example.test/search",
          method: "GET",
          hasCsrfToken: false,
          fieldNames: ["q"],
        },
      ],
      cookies: [
        {
          url: "https://example.test/",
          name: "session",
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
        },
      ],
    }) as never);

    await expect(adapter.scan({ targetUrl: "https://example.test/" })).resolves.toEqual([]);
  });
});
