import type {
  NormalizedFinding,
  SeverityLevel,
} from "@kodeaman/schema";
import type { ReportConfig } from "./types.js";
import { getStyles } from "./styles.js";
import {
  OWASP_CATEGORIES,
  headerTemplate,
  owaspDashboardTemplate,
  evidenceCardTemplate,
  gamificationTemplate,
  footerTemplate,
} from "./templates.js";

/**
 * OWASP scan report structure. Mirrors the schema type that worker-1 is adding.
 * TODO: Replace with import from @kodeaman/schema once OwaspScanReport is exported.
 */
export interface OwaspScanReport {
  scanId: string;
  startedAt: string;
  completedAt: string;
  environment: string;
  repoContext?: {
    repoFullName?: string;
    branch?: string;
    commitSha?: string;
    environment?: string;
  };
  categories: OwaspCategoryResult[];
  totalFindings: number;
  bySeverity: Record<SeverityLevel, number>;
  scannersUsed: string[];
}

export interface OwaspCategoryResult {
  categoryId: string;
  findings: NormalizedFinding[];
}

const SEVERITY_ORDER: SeverityLevel[] = [
  "critical",
  "high",
  "medium",
  "low",
  "info",
];

function maxSeverity(findings: NormalizedFinding[]): SeverityLevel {
  let best: SeverityLevel = "info";
  for (const f of findings) {
    if (SEVERITY_ORDER.indexOf(f.severity) < SEVERITY_ORDER.indexOf(best)) {
      best = f.severity;
    }
  }
  return best;
}

export class HtmlReportGenerator {
  generateReport(report: OwaspScanReport, config: ReportConfig): string {
    const locale = config.locale;
    const parts: string[] = [];

    // Header
    const header = headerTemplate({
      scanDate: report.completedAt,
      environment: report.repoContext?.environment ?? report.environment,
      totalFindings: report.totalFindings,
      bySeverity: report.bySeverity,
      repoName: report.repoContext?.repoFullName,
      branch: report.repoContext?.branch,
      locale,
      theme: config.theme,
    });
    parts.push(header.replace("{{STYLES}}", getStyles()));

    // OWASP Dashboard
    parts.push(this.generateOwaspDashboard(report, locale));
    parts.push(this.generateEvidencePolicy(config, locale));

    // Per-category sections
    for (const cat of report.categories) {
      const catMeta = OWASP_CATEGORIES.find((c) => c.id === cat.categoryId);
      if (!catMeta && cat.findings.length === 0) continue;

      const catName = catMeta
        ? locale === "id"
          ? `${catMeta.id}: ${catMeta.id_}`
          : `${catMeta.id}: ${catMeta.en}`
        : cat.categoryId;

      const findings = config.includeEvidence
        ? cat.findings.slice(0, config.maxFindingsPerCategory)
        : cat.findings;

      const sevBreakdown = this.severityBreakdown(findings);

      parts.push(`<section class="category-section">`);
      parts.push(`<div class="category-header">`);
      parts.push(`<h2>${this.escapeHtml(catName)}</h2>`);
      parts.push(`<div class="severity-breakdown">`);

      for (const sev of SEVERITY_ORDER) {
        const count = sevBreakdown[sev] || 0;
        if (count > 0) {
          parts.push(
            `<span class="severity-badge ${sev}">${count} ${sev.toUpperCase()}</span>`,
          );
        }
      }

      parts.push(`</div></div>`);

      for (const finding of findings) {
        parts.push(this.generateEvidenceCard(finding, locale));
      }

      parts.push(`</section>`);
    }

    // Gamification
    if (config.gamificationEnabled) {
      const gamData = this.extractGamification(report);
      parts.push(
        gamificationTemplate({
          xpEarned: gamData.xpEarned,
          badges: gamData.badges,
          streaks: gamData.streaks,
          locale,
        }),
      );
    }

    // Footer
    parts.push(footerTemplate(locale, new Date().toISOString()));

    return parts.join("\n");
  }

  generateEvidencePolicy(config: ReportConfig, locale: "en" | "id"): string {
    const title = locale === "id" ? "Kebijakan Bukti" : "Evidence Policy";
    const scannerText = locale === "id"
      ? "Temuan hanya boleh berasal dari output scanner dan bukti yang tersimpan; AI tidak boleh membuat temuan baru."
      : "Findings must come from scanner output and stored evidence only; AI-generated findings are not allowed.";
    const screenshotText = locale === "id"
      ? "Temuan web memerlukan screenshot, snapshot terminal, atau bukti HTTP sebelum dibagikan sebagai bukti stakeholder."
      : "Web findings require a screenshot, terminal snapshot, or HTTP evidence before stakeholder reporting.";
    const generatedText = config.generatedFindingsAllowed
      ? locale === "id" ? "Temuan buatan generator diizinkan oleh konfigurasi." : "Generated findings are allowed by configuration."
      : locale === "id" ? "Temuan buatan generator dinonaktifkan." : "Generated findings are disabled.";

    return `<section class="evidence-policy"><h2>${title}</h2><ul><li>${scannerText}</li><li>${screenshotText}</li><li>${generatedText}</li></ul></section>`;
  }

  generateEvidenceCard(
    finding: NormalizedFinding,
    locale: "en" | "id",
  ): string {
    const title =
      locale === "id" ? finding.coaching.titleId : finding.coaching.titleEn;
    const whyItMatters =
      locale === "id"
        ? finding.coaching.whyItMattersId
        : finding.coaching.whyItMattersEn;
    const remediation =
      locale === "id"
        ? finding.coaching.remediationId
        : finding.coaching.remediationEn;

    return evidenceCardTemplate({
      title,
      severity: finding.severity,
      filePath: finding.location.filePath,
      startLine: finding.location.startLine,
      url: finding.location.url,
      snippet: finding.location.snippet,
      whyItMatters,
      remediation,
      cwes: finding.classification.cwe ?? [],
      owaspRefs: finding.classification.owasp ?? [],
      confidence: finding.confidence,
      locale,
    });
  }

  generateOwaspDashboard(
    report: OwaspScanReport,
    locale: "en" | "id",
  ): string {
    const categoryCounts = new Map<
      string,
      { total: number; maxSeverity: SeverityLevel }
    >();

    for (const cat of report.categories) {
      categoryCounts.set(cat.categoryId, {
        total: cat.findings.length,
        maxSeverity: maxSeverity(cat.findings),
      });
    }

    return owaspDashboardTemplate(categoryCounts, locale);
  }

  private severityBreakdown(
    findings: NormalizedFinding[],
  ): Record<SeverityLevel, number> {
    const counts: Record<SeverityLevel, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };
    for (const f of findings) {
      counts[f.severity]++;
    }
    return counts;
  }

  private extractGamification(report: OwaspScanReport): {
    xpEarned: number;
    badges: string[];
    streaks: number;
  } {
    let xpEarned = 0;
    const badges = new Set<string>();
    let streaks = 0;

    for (const cat of report.categories) {
      for (const f of cat.findings) {
        if (f.gamification.xpReward) {
          xpEarned += f.gamification.xpReward;
        }
        if (f.gamification.badgeKey) {
          badges.add(f.gamification.badgeKey);
        }
        if (f.gamification.streakEligible) {
          streaks++;
        }
      }
    }

    return { xpEarned, badges: [...badges], streaks };
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
