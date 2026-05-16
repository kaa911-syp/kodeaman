import type { NormalizedFinding, RepoContext, SeverityLevel } from "@kodeaman/schema";
import { PlaywrightCrawler } from "./crawler.js";
import type { CookieInfo, CrawlResult, FormInfo, PlaywrightScanContext, SecurityHeaderCheck } from "./types.js";

export interface ScannerAdapter {
  readonly name: string;
  scan(context: PlaywrightScanContext, repoContext?: RepoContext): Promise<NormalizedFinding[]>;
}

export class PlaywrightAdapter implements ScannerAdapter {
  readonly name = "playwright";

  constructor(private readonly crawler = new PlaywrightCrawler()) {}

  async scan(context: PlaywrightScanContext, repoContext?: RepoContext): Promise<NormalizedFinding[]> {
    const crawlResult = await this.crawler.crawl(context);
    return this.mapCrawlResult(crawlResult, repoContext);
  }

  mapCrawlResult(result: CrawlResult, repoContext?: RepoContext): NormalizedFinding[] {
    return [
      ...result.securityHeaders.map((check) => this.mapSecurityHeader(check, repoContext)),
      ...result.forms.filter((form) => !form.hasCsrfToken && form.method !== "GET").map((form) => this.mapForm(form, repoContext)),
      ...result.cookies.flatMap((cookie) => this.mapCookie(cookie, repoContext)),
    ];
  }

  private mapSecurityHeader(check: SecurityHeaderCheck, repoContext?: RepoContext): NormalizedFinding {
    return this.buildFinding({
      ruleId: `missing-${check.header.toLowerCase()}`,
      title: `Missing ${check.header} header`,
      description: `${check.url} does not set ${check.header}. ${check.recommendation}`,
      severity: check.severity,
      category: "misconfiguration",
      owasp: "A05-security-misconfiguration",
      url: check.url,
      evidenceLabel: "HTTP response header check",
      evidenceContent: `${check.header}: missing`,
      repoContext,
    });
  }

  private mapForm(form: FormInfo, repoContext?: RepoContext): NormalizedFinding {
    return this.buildFinding({
      ruleId: "form-missing-csrf-token",
      title: "Form submitted without an apparent CSRF token",
      description: `${form.method} form at ${form.url} does not include a field name that looks like a CSRF token.`,
      severity: "medium",
      category: "csrf",
      owasp: "A01-broken-access-control",
      url: form.url,
      parameter: form.action,
      evidenceLabel: "Detected form fields",
      evidenceContent: form.fieldNames.length > 0 ? form.fieldNames.join(", ") : "No named fields detected",
      repoContext,
    });
  }

  private mapCookie(cookie: CookieInfo, repoContext?: RepoContext): NormalizedFinding[] {
    const findings: NormalizedFinding[] = [];
    if (!cookie.httpOnly) {
      findings.push(this.cookieFinding(cookie, "cookie-missing-httponly", "Cookie missing HttpOnly flag", "HttpOnly prevents client-side scripts from reading sensitive cookies.", "medium", repoContext));
    }
    if (!cookie.secure) {
      findings.push(this.cookieFinding(cookie, "cookie-missing-secure", "Cookie missing Secure flag", "Secure limits cookie transmission to HTTPS requests.", "medium", repoContext));
    }
    if (!cookie.sameSite || cookie.sameSite === "None") {
      findings.push(this.cookieFinding(cookie, "cookie-missing-samesite", "Cookie missing restrictive SameSite policy", "SameSite=Lax or SameSite=Strict reduces cross-site request risk.", "low", repoContext));
    }
    return findings;
  }

  private cookieFinding(cookie: CookieInfo, ruleId: string, title: string, detail: string, severity: SeverityLevel, repoContext?: RepoContext): NormalizedFinding {
    return this.buildFinding({
      ruleId,
      title,
      description: `${cookie.name} at ${cookie.url}: ${detail}`,
      severity,
      category: "misconfiguration",
      owasp: "A05-security-misconfiguration",
      url: cookie.url,
      parameter: cookie.name,
      evidenceLabel: "Cookie attributes",
      evidenceContent: `HttpOnly=${cookie.httpOnly}; Secure=${cookie.secure}; SameSite=${cookie.sameSite ?? "unset"}`,
      repoContext,
    });
  }

  private buildFinding(input: {
    ruleId: string;
    title: string;
    description: string;
    severity: SeverityLevel;
    category: NormalizedFinding["category"];
    owasp: NonNullable<NormalizedFinding["owaspCategory"]>;
    url: string;
    parameter?: string;
    evidenceLabel: string;
    evidenceContent: string;
    repoContext?: RepoContext;
  }): NormalizedFinding {
    const id = stableId(`${input.ruleId}:${input.url}:${input.parameter ?? ""}`);

    return {
      schemaVersion: "1.0.0",
      findingId: `playwright-${id}`,
      dedupeKey: `playwright:${input.ruleId}:${input.url}:${input.parameter ?? ""}`,
      source: "playwright",
      category: input.category,
      surface: "web-page",
      owaspCategory: input.owasp,
      severity: input.severity,
      confidence: "medium",
      status: "open",
      title: input.title,
      description: input.description,
      location: { url: input.url, parameter: input.parameter },
      evidence: [{ type: "http-response", label: input.evidenceLabel, content: input.evidenceContent }],
      classification: { owasp: [input.owasp], owaspCategories: [input.owasp] },
      raw: { tool: "playwright", toolRuleId: input.ruleId, toolFindingId: `playwright-${id}`, rawSeverity: input.severity },
      repoContext: input.repoContext,
      prioritization: {
        baseSeverity: input.severity,
        adjustedSeverity: input.severity,
        priorityScore: severityScore(input.severity),
        confidenceScore: 60,
        reasons: [],
      },
      coaching: {
        titleEn: input.title,
        titleId: input.title,
        summaryEn: input.description,
        summaryId: input.description,
        whyItMattersEn: "Runtime browser checks catch web security controls that static analysis cannot see.",
        whyItMattersId: "Pemeriksaan browser runtime menemukan kontrol keamanan web yang tidak terlihat oleh analisis statis.",
        remediationEn: [input.description],
        remediationId: [input.description],
      },
      gamification: { issueFamily: input.category },
      detectedAt: new Date().toISOString(),
    };
  }
}

function stableId(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16);
}

function severityScore(severity: SeverityLevel): number {
  return { info: 10, low: 25, medium: 50, high: 75, critical: 100 }[severity];
}
