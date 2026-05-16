import type { NormalizedFinding, SeverityLevel } from "@kodeaman/schema";
import type { ScanResult, OwaspScanReport, CoverageReport } from "./renderer.js";

const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  critical: "\x1b[31m",
  high: "\x1b[91m",
  medium: "\x1b[33m",
  low: "\x1b[36m",
  info: "\x1b[37m",
};

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

export class CLIRenderer {
  renderConsole(
    result: ScanResult,
    config: { language: "en" | "id" },
  ): string {
    const locale = config.language;
    const lines: string[] = [];

    lines.push("");
    lines.push(
      `${BOLD}  KodeAman Security Report${RESET}`,
    );
    lines.push(`${DIM}${"─".repeat(50)}${RESET}`);
    lines.push("");

    const { summary } = result;
    const critical = summary.bySeverity.critical || 0;
    const high = summary.bySeverity.high || 0;
    const medium = summary.bySeverity.medium || 0;
    const low = summary.bySeverity.low || 0;
    const info = summary.bySeverity.info || 0;

    lines.push(
      locale === "id"
        ? `  Ditemukan ${BOLD}${summary.totalFindings}${RESET} masalah:`
        : `  Found ${BOLD}${summary.totalFindings}${RESET} issues:`,
    );
    if (critical > 0)
      lines.push(
        `    ${SEVERITY_COLORS.critical}CRITICAL: ${critical}${RESET}`,
      );
    if (high > 0)
      lines.push(`    ${SEVERITY_COLORS.high}HIGH: ${high}${RESET}`);
    if (medium > 0)
      lines.push(`    ${SEVERITY_COLORS.medium}MEDIUM: ${medium}${RESET}`);
    if (low > 0)
      lines.push(`    ${SEVERITY_COLORS.low}LOW: ${low}${RESET}`);
    if (info > 0)
      lines.push(`    ${SEVERITY_COLORS.info}INFO: ${info}${RESET}`);

    lines.push("");
    lines.push(`${DIM}${"─".repeat(50)}${RESET}`);

    for (const finding of result.findings) {
      lines.push(this.renderFindingLine(finding, locale));
    }

    lines.push("");
    return lines.join("\n");
  }

  renderCoverageReport(coverage: CoverageReport, locale: "en" | "id"): string {
    const lines: string[] = [];

    lines.push("");
    lines.push(`${BOLD}  ${locale === "id" ? "Laporan Cakupan Scanner" : "Scanner Coverage Report"}${RESET}`);
    lines.push(`${DIM}${"─".repeat(70)}${RESET}`);
    lines.push(
      locale === "id"
        ? `  Cakupan OWASP: ${BOLD}${coverage.overallCoveragePercent}%${RESET}`
        : `  OWASP coverage: ${BOLD}${coverage.overallCoveragePercent}%${RESET}`,
    );
    lines.push("");

    const header = `  ${"Scanner".padEnd(18)} ${"Status".padEnd(18)} ${"Findings".padEnd(10)} ${"Duration".padEnd(10)} Reason`;
    lines.push(header);
    lines.push(`  ${"─".repeat(68)}`);

    const skipped = new Map(coverage.scannersSkipped.map((scanner) => [scanner.name, scanner.reason]));
    for (const scanner of coverage.scannersConfigured) {
      const ran = coverage.scannersRan.includes(scanner);
      const reason = skipped.get(scanner) ?? "";
      const errored = reason.toLowerCase().includes("error");
      const status = ran
        ? `\x1b[32m✅ ran${RESET}`
        : errored
          ? `\x1b[31m❌ error${RESET}`
          : `\x1b[33m⚠️ skipped${RESET}`;
      const findingsCount = coverage.owaspCoverage
        .filter((category) => category.coveredBy.includes(scanner))
        .reduce((sum, category) => sum + category.findingsCount, 0);
      lines.push(
        `  ${scanner.padEnd(18)} ${status.padEnd(27)} ${String(findingsCount).padEnd(10)} ${"-".padEnd(10)} ${reason}`,
      );
    }

    lines.push("");
    lines.push(`  ${locale === "id" ? "Cakupan OWASP" : "OWASP Coverage"}`);
    lines.push(`  ${"Category".padEnd(45)} ${"Covered".padEnd(10)} ${"By"}`);
    lines.push(`  ${"─".repeat(68)}`);
    for (const category of coverage.owaspCoverage) {
      const covered = category.covered ? `\x1b[32myes${RESET}` : `\x1b[33mno${RESET}`;
      lines.push(
        `  ${`${category.categoryId}: ${category.categoryName}`.slice(0, 43).padEnd(45)} ${covered.padEnd(19)} ${category.coveredBy.join(", ") || "-"}`,
      );
    }

    lines.push("");
    return lines.join("\n");
  }

  renderTable(findings: NormalizedFinding[]): string {
    const header = `${"#".padEnd(4)} ${"Severity".padEnd(10)} ${"Title".padEnd(40)} ${"Location".padEnd(30)}`;
    const separator = "─".repeat(header.length);
    const lines: string[] = [header, separator];

    for (let i = 0; i < findings.length; i++) {
      const f = findings[i];
      const num = String(i + 1).padEnd(4);
      const sev = `${SEVERITY_COLORS[f.severity]}${f.severity.toUpperCase().padEnd(10)}${RESET}`;
      const title = f.title.slice(0, 38).padEnd(40);
      const loc = f.location.filePath
        ? `${f.location.filePath}${f.location.startLine ? `:${f.location.startLine}` : ""}`.slice(
            0,
            28,
          ).padEnd(30)
        : (f.location.url || "-").slice(0, 28).padEnd(30);
      lines.push(`${num} ${sev} ${title} ${loc}`);
    }

    return lines.join("\n");
  }

  renderOwaspConsole(
    report: OwaspScanReport,
    config: { language: "en" | "id" },
  ): string {
    const locale = config.language;
    const lines: string[] = [];

    lines.push("");
    lines.push(
      `${BOLD}  KodeAman OWASP Top 10 Report${RESET}`,
    );
    lines.push(`${DIM}${"─".repeat(60)}${RESET}`);
    lines.push("");

    const critical = report.bySeverity.critical || 0;
    const high = report.bySeverity.high || 0;
    const medium = report.bySeverity.medium || 0;
    const low = report.bySeverity.low || 0;
    const info = report.bySeverity.info || 0;

    lines.push(
      locale === "id"
        ? `  Ditemukan ${BOLD}${report.totalFindings}${RESET} masalah:`
        : `  Found ${BOLD}${report.totalFindings}${RESET} issues:`,
    );
    if (critical > 0)
      lines.push(
        `    ${SEVERITY_COLORS.critical}CRITICAL: ${critical}${RESET}`,
      );
    if (high > 0)
      lines.push(`    ${SEVERITY_COLORS.high}HIGH: ${high}${RESET}`);
    if (medium > 0)
      lines.push(`    ${SEVERITY_COLORS.medium}MEDIUM: ${medium}${RESET}`);
    if (low > 0)
      lines.push(`    ${SEVERITY_COLORS.low}LOW: ${low}${RESET}`);
    if (info > 0)
      lines.push(`    ${SEVERITY_COLORS.info}INFO: ${info}${RESET}`);

    lines.push("");
    lines.push(`${DIM}${"─".repeat(60)}${RESET}`);

    // OWASP category ASCII table
    const catLabel = locale === "id" ? "Kategori" : "Category";
    const header = `  ${"#".padEnd(5)} ${catLabel.padEnd(38)} ${"Findings".padEnd(10)}`;
    lines.push(header);
    lines.push(`  ${"─".repeat(55)}`);

    const OWASP_NAMES: Record<string, { en: string; id: string }> = {
      A01: { en: "Broken Access Control", id: "Kontrol Akses Rusak" },
      A02: { en: "Cryptographic Failures", id: "Kegagalan Kriptografi" },
      A03: { en: "Injection", id: "Injeksi" },
      A04: { en: "Insecure Design", id: "Desain Tidak Aman" },
      A05: { en: "Security Misconfiguration", id: "Konfigurasi Salah" },
      A06: { en: "Vulnerable Components", id: "Komponen Rentan" },
      A07: { en: "Auth Failures", id: "Kegagalan Autentikasi" },
      A08: { en: "Integrity Failures", id: "Kegagalan Integritas" },
      A09: { en: "Logging Failures", id: "Kegagalan Logging" },
      A10: { en: "SSRF", id: "SSRF" },
    };

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

      let countStr: string;
      if (count === 0) {
        countStr = `${DIM}0${RESET}`;
      } else {
        const maxSev = this.getMaxSeverity(cat!.findings);
        const color = SEVERITY_COLORS[maxSev];
        countStr = `${color}${count}${RESET}`;
      }

      lines.push(
        `  ${catId.padEnd(5)} ${name.slice(0, 36).padEnd(38)} ${countStr}`,
      );
    }

    lines.push("");
    lines.push(`${DIM}${"─".repeat(60)}${RESET}`);

    // Detailed findings per category
    for (const cat of report.categories) {
      if (cat.findings.length === 0) continue;
      const names = OWASP_NAMES[cat.categoryId];
      const catName = names
        ? locale === "id"
          ? names.id
          : names.en
        : cat.categoryId;

      lines.push("");
      lines.push(`  ${BOLD}${cat.categoryId}: ${catName}${RESET}`);

      for (const finding of cat.findings) {
        lines.push(this.renderFindingLine(finding, locale));
      }
    }

    lines.push("");
    return lines.join("\n");
  }

  private getMaxSeverity(findings: NormalizedFinding[]): SeverityLevel {
    const order: SeverityLevel[] = ["critical", "high", "medium", "low", "info"];
    let best: SeverityLevel = "info";
    for (const f of findings) {
      if (order.indexOf(f.severity) < order.indexOf(best)) {
        best = f.severity;
      }
    }
    return best;
  }

  private renderFindingLine(
    finding: NormalizedFinding,
    locale: "en" | "id",
  ): string {
    const color = SEVERITY_COLORS[finding.severity];
    const title =
      locale === "id" ? finding.coaching.titleId : finding.coaching.titleEn;
    const loc = finding.location.filePath
      ? `${finding.location.filePath}${finding.location.startLine ? `:${finding.location.startLine}` : ""}`
      : finding.location.url || "";

    return `  ${color}[${finding.severity.toUpperCase()}]${RESET} ${title}\n${DIM}           ${loc}${RESET}`;
  }
}
