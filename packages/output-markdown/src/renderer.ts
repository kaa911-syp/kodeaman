import type { NormalizedFinding, SeverityLevel } from "@aspidasec/schema";

export interface CoverageReport {
  scannersConfigured: string[];
  scannersRan: string[];
  scannersSkipped: { name: string; reason: string }[];
  owaspCoverage: {
    categoryId: string;
    categoryName: string;
    covered: boolean;
    coveredBy: string[];
    findingsCount: number;
  }[];
  overallCoveragePercent: number;
  scanSurfaces: {
    surface: string;
    covered: boolean;
    scanners: string[];
  }[];
}

/**
 * OWASP scan report structure. Mirrors the schema type that worker-1 is adding.
 * TODO: Replace with import from @aspidasec/schema once OwaspScanReport is exported.
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

const OWASP_NAMES: Record<string, { en: string; id: string }> = {
  A01: { en: "Broken Access Control", id: "Kontrol Akses Rusak" },
  A02: { en: "Cryptographic Failures", id: "Kegagalan Kriptografis" },
  A03: { en: "Injection", id: "Injeksi" },
  A04: { en: "Insecure Design", id: "Desain Tidak Aman" },
  A05: { en: "Security Misconfiguration", id: "Kesalahan Konfigurasi Keamanan" },
  A06: { en: "Vulnerable & Outdated Components", id: "Komponen Rentan dan Kedaluwarsa" },
  A07: { en: "Identification & Authentication Failures", id: "Kegagalan Identifikasi dan Autentikasi" },
  A08: { en: "Software & Data Integrity Failures", id: "Kegagalan Integritas Perangkat Lunak dan Data" },
  A09: { en: "Security Logging & Monitoring Failures", id: "Kegagalan Logging dan Pemantauan Keamanan" },
  A10: { en: "Server-Side Request Forgery", id: "Pemalsuan Permintaan Sisi Server" },
};

export interface ScanSummary {
  totalFindings: number;
  bySeverity: Record<SeverityLevel, number>;
  scanDurationMs: number;
  scannersUsed: string[];
}

export interface ScanResult {
  findings: NormalizedFinding[];
  summary: ScanSummary;
  repoName?: string;
  branch?: string;
  commitSha?: string;
}

export interface GamificationData {
  xpEarned: number;
  badges: string[];
  streaks: number;
}

const SEVERITY_EMOJI: Record<SeverityLevel, string> = {
  critical: "\u{1F534}",
  high: "\u{1F7E0}",
  medium: "\u{1F7E1}",
  low: "\u{1F535}",
  info: "\u{26AA}",
};

const SEVERITY_ORDER: SeverityLevel[] = [
  "critical",
  "high",
  "medium",
  "low",
  "info",
];

function severityIndex(s: SeverityLevel): number {
  return SEVERITY_ORDER.indexOf(s);
}

export class MarkdownRenderer {
  renderPRComment(
    result: ScanResult,
    config: { language: "en" | "id"; prioritization: { maxFindingsInComment: number }; gamification: { enabled: boolean } },
  ): string {
    const locale = config.language;
    const lines: string[] = [];

    lines.push("## \u{1F6E1}\uFE0F AspidaSec Security Report");
    lines.push("");

    lines.push(this.renderSummary(result.summary, locale));
    lines.push("");

    const sorted = [...result.findings].sort(
      (a, b) => severityIndex(a.severity) - severityIndex(b.severity),
    );

    const top = sorted.slice(0, config.prioritization.maxFindingsInComment);
    const rest = sorted.slice(config.prioritization.maxFindingsInComment);

    if (top.length > 0) {
      lines.push(
        locale === "id" ? "### Temuan Utama" : "### Top Findings",
      );
      lines.push("");

      for (let i = 0; i < top.length; i++) {
        lines.push(this.renderFinding(top[i], locale, i + 1));
        lines.push("");
        lines.push("---");
        lines.push("");
      }
    }

    if (rest.length > 0) {
      const detailsTitle =
        locale === "id"
          ? `\u{1F4CB} Semua temuan (${result.findings.length} total)`
          : `\u{1F4CB} All findings (${result.findings.length} total)`;

      lines.push(`<details><summary>${detailsTitle}</summary>`);
      lines.push("");
      lines.push(
        `| # | ${locale === "id" ? "Tingkat" : "Severity"} | ${locale === "id" ? "Judul" : "Title"} | ${locale === "id" ? "Lokasi" : "Location"} |`,
      );
      lines.push("| --- | --- | --- | --- |");

      for (let i = 0; i < rest.length; i++) {
        const f = rest[i];
        const loc = f.location.filePath
          ? `\`${f.location.filePath}${f.location.startLine ? `:${f.location.startLine}` : ""}\``
          : f.location.url || "-";
        const title =
          locale === "id" ? f.coaching.titleId : f.coaching.titleEn;
        lines.push(
          `| ${i + top.length + 1} | ${SEVERITY_EMOJI[f.severity]} ${f.severity.toUpperCase()} | ${title} | ${loc} |`,
        );
      }

      lines.push("");
      lines.push("</details>");
      lines.push("");
    }

    if (config.gamification.enabled) {
      const gamData = this.extractGamification(result.findings);
      lines.push(this.renderGamification(gamData.xpEarned, gamData.badges, gamData.streaks, locale));
    }

    lines.push("");
    lines.push(
      locale === "id"
        ? "*Dibuat oleh [AspidaSec](https://github.com/kaa911-syp/AspidaSec) — Security coach untuk developer Indonesia*"
        : "*Generated by [AspidaSec](https://github.com/kaa911-syp/AspidaSec) — Security coach for Indonesian developers*",
    );

    return lines.join("\n");
  }

  renderCoverageReport(coverage: CoverageReport, locale: "en" | "id"): string {
    const lines: string[] = [];
    const title = locale === "id" ? "### Laporan Cakupan Scanner" : "### Scanner Coverage Report";

    lines.push(title);
    lines.push("");
    lines.push(
      locale === "id"
        ? `**Cakupan OWASP:** ${coverage.overallCoveragePercent}%`
        : `**OWASP coverage:** ${coverage.overallCoveragePercent}%`,
    );
    lines.push("");
    lines.push("| Scanner | Status | Findings | Duration | Reason |");
    lines.push("| --- | --- | ---: | ---: | --- |");

    const skipped = new Map(coverage.scannersSkipped.map((scanner) => [scanner.name, scanner.reason]));
    for (const scanner of coverage.scannersConfigured) {
      const ran = coverage.scannersRan.includes(scanner);
      const reason = skipped.get(scanner) ?? "";
      const status = ran ? "✅ ran" : reason.toLowerCase().includes("error") ? "❌ error" : "⚠️ skipped";
      const categoryFindings = coverage.owaspCoverage
        .filter((category) => category.coveredBy.includes(scanner))
        .reduce((sum, category) => sum + category.findingsCount, 0);
      lines.push(`| ${scanner} | ${status} | ${categoryFindings} | - | ${reason} |`);
    }

    lines.push("");
    lines.push(locale === "id" ? "#### Cakupan OWASP" : "#### OWASP Coverage");
    lines.push("");
    lines.push("| Category | Covered | Covered by | Findings |");
    lines.push("| --- | --- | --- | ---: |");
    for (const category of coverage.owaspCoverage) {
      lines.push(
        `| ${category.categoryId}: ${category.categoryName} | ${category.covered ? "Yes" : "No"} | ${category.coveredBy.join(", ") || "-"} | ${category.findingsCount} |`,
      );
    }

    lines.push("");
    return lines.join("\n");
  }

  renderFinding(
    finding: NormalizedFinding,
    locale: "en" | "id",
    index?: number,
  ): string {
    const lines: string[] = [];
    const title =
      locale === "id" ? finding.coaching.titleId : finding.coaching.titleEn;
    const prefix = index !== undefined ? `${index}. ` : "";

    lines.push(
      `#### ${prefix}[${finding.severity.toUpperCase()}] ${title}`,
    );

    if (finding.location.filePath) {
      const loc = `${finding.location.filePath}${finding.location.startLine ? `:${finding.location.startLine}` : ""}`;
      lines.push(`\u{1F4C1} \`${loc}\``);
    } else if (finding.location.url) {
      lines.push(`\u{1F310} \`${finding.location.url}\``);
    }

    if (finding.occurrences && finding.occurrences.length > 1) {
      const primaryOccurrence = `${finding.location.component ?? ""}\0${finding.location.filePath ?? finding.location.url ?? ""}`;
      const alsoFound = finding.occurrences
        .filter((occurrence) => `${occurrence.target ?? ""}\0${occurrence.filePath}` !== primaryOccurrence)
        .map((occurrence) => occurrence.target ? `${occurrence.target}/${occurrence.filePath}` : occurrence.filePath);
      if (alsoFound.length > 0) {
        lines.push(locale === "id"
          ? `Juga ditemukan di: ${alsoFound.join(", ")}`
          : `Also found in: ${alsoFound.join(", ")}`);
      }
    }

    lines.push("");

    const whyLabel =
      locale === "id" ? "**Kenapa ini penting:**" : "**Why this matters:**";
    const whyText =
      locale === "id"
        ? finding.coaching.whyItMattersId
        : finding.coaching.whyItMattersEn;
    lines.push(`${whyLabel} ${whyText}`);
    lines.push("");

    const fixLabel =
      locale === "id" ? "**Cara memperbaiki:**" : "**How to fix:**";
    const steps =
      locale === "id"
        ? finding.coaching.remediationId
        : finding.coaching.remediationEn;
    lines.push(fixLabel);
    for (const step of steps) {
      lines.push(`- ${step}`);
    }

    if (finding.fixCommands && finding.fixCommands.length > 0) {
      lines.push("");
      lines.push("**Fix:**");
      for (const fixCommand of finding.fixCommands) {
        lines.push("```sh");
        lines.push(fixCommand.cwd ? `cd ${fixCommand.cwd} && ${fixCommand.command}` : fixCommand.command);
        lines.push("```");
      }
    }

    if (finding.coaching.safeExampleCode) {
      lines.push("");
      const exTitle =
        locale === "id"
          ? finding.coaching.safeExampleTitle || "Contoh kode aman"
          : finding.coaching.safeExampleTitle || "Safe code example";
      lines.push(`<details><summary>${exTitle}</summary>`);
      lines.push("");
      lines.push("```");
      lines.push(finding.coaching.safeExampleCode);
      lines.push("```");
      lines.push("");
      lines.push("</details>");
    }

    if (finding.coaching.lessonSlug) {
      const minutes = finding.coaching.lessonEstimatedMinutes ?? 5;
      const learnLabel =
        locale === "id" ? "Pelajari lebih lanjut" : "Learn more";
      lines.push("");
      lines.push(
        `\u{1F4D6} [${learnLabel}](/lessons/${finding.coaching.lessonSlug}) (~${minutes} ${locale === "id" ? "menit" : "min"})`,
      );
    }

    return lines.join("\n");
  }

  renderSummary(summary: ScanSummary, locale: "en" | "id"): string {
    const critical = summary.bySeverity.critical || 0;
    const high = summary.bySeverity.high || 0;

    if (locale === "id") {
      return `**Ditemukan ${summary.totalFindings} masalah** (${critical} critical, ${high} high)`;
    }
    return `**Found ${summary.totalFindings} issues** (${critical} critical, ${high} high)`;
  }

  renderGamification(
    xpEarned: number,
    badges: string[],
    streaks: number,
    locale: "en" | "id",
  ): string {
    const parts: string[] = [];

    if (xpEarned > 0) {
      parts.push(`**+${xpEarned} XP**`);
    }

    if (badges.length > 0) {
      const badgeLabel = locale === "id" ? "Badge" : "Badges";
      parts.push(`\u{1F3C6} ${badgeLabel}: ${badges.join(" | ")}`);
    }

    if (streaks > 0) {
      parts.push(`\u{1F525} Streak: ${streaks}`);
    }

    return parts.join(" | ");
  }

  renderOwaspReport(
    report: OwaspScanReport,
    config: {
      language: "en" | "id";
      gamification: { enabled: boolean };
      maxFindingsPerCategory?: number;
    },
  ): string {
    const locale = config.language;
    const lines: string[] = [];

    lines.push("## AspidaSec OWASP Top 10 Report");
    lines.push("");

    // Summary
    const critical = report.bySeverity.critical || 0;
    const high = report.bySeverity.high || 0;
    if (locale === "id") {
      lines.push(
        `**Ditemukan ${report.totalFindings} masalah** (${critical} critical, ${high} high)`,
      );
    } else {
      lines.push(
        `**Found ${report.totalFindings} issues** (${critical} critical, ${high} high)`,
      );
    }
    lines.push("");

    // OWASP Dashboard table
    const catHeader =
      locale === "id" ? "Kategori" : "Category";
    const findingsHeader =
      locale === "id" ? "Temuan" : "Findings";
    const severityHeader =
      locale === "id" ? "Tertinggi" : "Highest";

    lines.push(
      `| ${catHeader} | ${findingsHeader} | ${severityHeader} |`,
    );
    lines.push("| --- | --- | --- |");

    const OWASP_IDS = [
      "A01", "A02", "A03", "A04", "A05",
      "A06", "A07", "A08", "A09", "A10",
    ];

    for (const catId of OWASP_IDS) {
      const cat = report.categories.find((c) => c.categoryId === catId);
      const count = cat?.findings.length ?? 0;
      const names = OWASP_NAMES[catId];
      const name = names
        ? locale === "id"
          ? names.id
          : names.en
        : catId;
      const maxSev =
        count > 0 ? this.getMaxSeverity(cat!.findings) : "-";
      const sevEmoji = typeof maxSev === "string" && maxSev !== "-"
        ? `${SEVERITY_EMOJI[maxSev as SeverityLevel]} ${maxSev.toUpperCase()}`
        : "-";
      lines.push(`| ${catId}: ${name} | ${count} | ${sevEmoji} |`);
    }

    lines.push("");

    // Per-category details
    const maxFindings = config.maxFindingsPerCategory ?? 10;

    for (const cat of report.categories) {
      if (cat.findings.length === 0) continue;
      const names = OWASP_NAMES[cat.categoryId];
      const catName = names
        ? locale === "id"
          ? `${cat.categoryId}: ${names.id}`
          : `${cat.categoryId}: ${names.en}`
        : cat.categoryId;

      lines.push(`### ${catName}`);
      lines.push("");

      const sorted = [...cat.findings].sort(
        (a, b) => severityIndex(a.severity) - severityIndex(b.severity),
      );
      const shown = sorted.slice(0, maxFindings);

      for (let i = 0; i < shown.length; i++) {
        lines.push(this.renderFinding(shown[i], locale, i + 1));
        lines.push("");
        lines.push("---");
        lines.push("");
      }

      if (sorted.length > maxFindings) {
        lines.push(
          locale === "id"
            ? `*...dan ${sorted.length - maxFindings} temuan lainnya*`
            : `*...and ${sorted.length - maxFindings} more findings*`,
        );
        lines.push("");
      }
    }

    // Gamification
    if (config.gamification.enabled) {
      const allFindings = report.categories.flatMap((c) => c.findings);
      const gamData = this.extractGamification(allFindings);
      lines.push(
        this.renderGamification(
          gamData.xpEarned,
          gamData.badges,
          gamData.streaks,
          locale,
        ),
      );
    }

    lines.push("");
    lines.push(
      locale === "id"
        ? "*Dibuat oleh [AspidaSec](https://github.com/kaa911-syp/AspidaSec) — Security coach untuk developer Indonesia*"
        : "*Generated by [AspidaSec](https://github.com/kaa911-syp/AspidaSec) — Security coach for Indonesian developers*",
    );

    return lines.join("\n");
  }

  private getMaxSeverity(findings: NormalizedFinding[]): SeverityLevel {
    let best: SeverityLevel = "info";
    for (const f of findings) {
      if (severityIndex(f.severity) < severityIndex(best)) {
        best = f.severity;
      }
    }
    return best;
  }

  private extractGamification(findings: NormalizedFinding[]): GamificationData {
    let xpEarned = 0;
    const badges = new Set<string>();
    let streaks = 0;

    for (const f of findings) {
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

    return {
      xpEarned,
      badges: [...badges],
      streaks,
    };
  }
}
