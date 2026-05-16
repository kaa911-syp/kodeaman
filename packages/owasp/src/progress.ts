/**
 * OWASP scan progress reporter with bilingual (EN/ID) output.
 */

import type { OwaspCategoryId } from "./categories.js";
import type { ScannerInfo } from "./environment.js";

export class OwaspProgressReporter {
  private locale: "en" | "id";
  private output: (message: string) => void;

  constructor(locale: "en" | "id" = "en", output?: (message: string) => void) {
    this.locale = locale;
    this.output = output ?? ((msg: string) => console.log(msg));
  }

  reportPhaseStart(categoryId: OwaspCategoryId, categoryName: string): void {
    const msg =
      this.locale === "id"
        ? `[OWASP] Memulai pemindaian ${categoryId}: ${categoryName}...`
        : `[OWASP] Starting scan for ${categoryId}: ${categoryName}...`;
    this.output(msg);
  }

  reportPhaseComplete(
    categoryId: OwaspCategoryId,
    categoryName: string,
    findingsCount: number,
    durationMs: number
  ): void {
    const seconds = (durationMs / 1000).toFixed(1);

    if (this.locale === "id") {
      const findingText = findingsCount === 0 ? "tidak ada" : String(findingsCount);
      this.output(
        `[OWASP] ${categoryId} ${categoryName}: ${findingText} temuan (${seconds}d)`
      );
    } else {
      const findingText = findingsCount === 0 ? "no" : String(findingsCount);
      this.output(
        `[OWASP] ${categoryId} ${categoryName}: ${findingText} finding(s) (${seconds}s)`
      );
    }
  }

  reportSummary(
    totalFindings: number,
    totalFiltered: number,
    totalDurationMs: number,
    categoriesScanned: number
  ): void {
    const seconds = (totalDurationMs / 1000).toFixed(1);
    this.output("");

    if (this.locale === "id") {
      this.output("=== Ringkasan Pemindaian OWASP Top 10 ===");
      this.output(`Kategori dipindai : ${categoriesScanned}/10`);
      this.output(`Total temuan      : ${totalFindings}`);
      this.output(`Difilter          : ${totalFiltered}`);
      this.output(`Durasi            : ${seconds} detik`);
    } else {
      this.output("=== OWASP Top 10 Scan Summary ===");
      this.output(`Categories scanned: ${categoriesScanned}/10`);
      this.output(`Total findings    : ${totalFindings}`);
      this.output(`Filtered out      : ${totalFiltered}`);
      this.output(`Duration          : ${seconds}s`);
    }

    this.output("");
  }

  reportWSLRequired(scannersMissing: string[]): void {
    if (this.locale === "id") {
      this.output(
        `[OWASP] Peringatan: Pemindai berikut tidak tersedia: ${scannersMissing.join(", ")}`
      );
      this.output(
        "[OWASP] WSL diperlukan untuk menjalankan pemindai berbasis Linux pada Windows."
      );
      this.output(
        "[OWASP] Jalankan 'wsl --install -d Ubuntu' di PowerShell (Administrator) untuk menginstal WSL."
      );
    } else {
      this.output(
        `[OWASP] Warning: The following scanners are not available: ${scannersMissing.join(", ")}`
      );
      this.output(
        "[OWASP] WSL is required to run Linux-based scanners on Windows."
      );
      this.output(
        "[OWASP] Run 'wsl --install -d Ubuntu' in PowerShell (Administrator) to install WSL."
      );
    }
  }

  reportScannerStatus(scanners: ScannerInfo[]): void {
    if (this.locale === "id") {
      this.output("[OWASP] Status pemindai:");
    } else {
      this.output("[OWASP] Scanner status:");
    }

    for (const scanner of scanners) {
      const status = scanner.available ? "OK" : "MISSING";
      const version = scanner.version ? ` (${scanner.version})` : "";
      this.output(`  ${status} ${scanner.name}${version}`);
    }
  }
}
