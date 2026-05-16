import type { SeverityLevel } from "@kodeaman/schema";

/**
 * OWASP Top 10 (2021) categories with bilingual names.
 */
export const OWASP_CATEGORIES = [
  { id: "A01", en: "Broken Access Control", id_: "Kontrol Akses Rusak" },
  { id: "A02", en: "Cryptographic Failures", id_: "Kegagalan Kriptografi" },
  { id: "A03", en: "Injection", id_: "Injeksi" },
  { id: "A04", en: "Insecure Design", id_: "Desain Tidak Aman" },
  { id: "A05", en: "Security Misconfiguration", id_: "Konfigurasi Keamanan Salah" },
  { id: "A06", en: "Vulnerable & Outdated Components", id_: "Komponen Rentan & Usang" },
  { id: "A07", en: "Identification & Authentication Failures", id_: "Kegagalan Identifikasi & Autentikasi" },
  { id: "A08", en: "Software & Data Integrity Failures", id_: "Kegagalan Integritas Software & Data" },
  { id: "A09", en: "Security Logging & Monitoring Failures", id_: "Kegagalan Logging & Monitoring Keamanan" },
  { id: "A10", en: "Server-Side Request Forgery", id_: "Pemalsuan Permintaan Sisi Server" },
] as const;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function headerTemplate(opts: {
  scanDate: string;
  environment?: string;
  totalFindings: number;
  bySeverity: Record<SeverityLevel, number>;
  repoName?: string;
  branch?: string;
  locale: "en" | "id";
  theme: "light" | "dark" | "auto";
}): string {
  const themeAttr = opts.theme === "auto" ? "" : ` data-theme="${opts.theme}"`;
  const title = opts.locale === "id" ? "Laporan Keamanan" : "Security Report";
  const dateLabel = opts.locale === "id" ? "Tanggal Scan" : "Scan Date";
  const envLabel = opts.locale === "id" ? "Lingkungan" : "Environment";
  const totalLabel = opts.locale === "id" ? "Total Temuan" : "Total Findings";

  const metaParts: string[] = [];
  metaParts.push(`<span>${dateLabel}: ${escapeHtml(opts.scanDate)}</span>`);
  if (opts.environment) {
    metaParts.push(`<span>${envLabel}: ${escapeHtml(opts.environment)}</span>`);
  }
  if (opts.repoName) {
    metaParts.push(`<span>Repo: ${escapeHtml(opts.repoName)}</span>`);
  }
  if (opts.branch) {
    metaParts.push(`<span>Branch: ${escapeHtml(opts.branch)}</span>`);
  }

  const severityStats = (["critical", "high", "medium", "low", "info"] as const)
    .filter((s) => opts.bySeverity[s] > 0)
    .map(
      (s) =>
        `<div class="summary-stat"><span class="stat-value" style="color:var(--color-${s})">${opts.bySeverity[s]}</span><span class="stat-label">${s.toUpperCase()}</span></div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="${opts.locale}"${themeAttr}>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KodeAman ${title}</title>
<style>{{STYLES}}</style>
</head>
<body>
<div class="report-container">
<header class="report-header">
<div class="logo-text">KodeAman</div>
<h1>${title}</h1>
<div class="report-meta">${metaParts.join("")}</div>
<div class="summary-bar">
<div class="summary-stat"><span class="stat-value">${opts.totalFindings}</span><span class="stat-label">${totalLabel}</span></div>
${severityStats}
</div>
</header>`;
}

export function owaspDashboardTemplate(
  categoryCounts: Map<string, { total: number; maxSeverity: SeverityLevel }>,
  locale: "en" | "id",
): string {
  const title = locale === "id" ? "Dashboard OWASP Top 10" : "OWASP Top 10 Dashboard";

  const severityToBg: Record<SeverityLevel, string> = {
    critical: "var(--color-critical)",
    high: "var(--color-high)",
    medium: "var(--color-medium)",
    low: "var(--color-low)",
    info: "var(--color-info)",
  };

  const cells = OWASP_CATEGORIES.map((cat) => {
    const data = categoryCounts.get(cat.id);
    const count = data?.total ?? 0;
    const bgColor = count > 0 ? severityToBg[data!.maxSeverity] : "var(--color-info)";
    const name = locale === "id" ? cat.id_ : cat.en;
    return `<div class="owasp-cell"><span class="owasp-id">${cat.id}: ${escapeHtml(name)}</span><span class="owasp-count" style="background:${bgColor}">${count}</span></div>`;
  }).join("");

  return `<section>
<h2 style="font-size:1.5rem;font-weight:700;margin:1.5rem 0 0.5rem">${title}</h2>
<div class="owasp-grid">${cells}</div>
</section>`;
}

export function evidenceCardTemplate(opts: {
  title: string;
  severity: SeverityLevel;
  filePath?: string;
  startLine?: number;
  url?: string;
  snippet?: string;
  whyItMatters: string;
  remediation: string[];
  cwes: string[];
  owaspRefs: string[];
  confidence: string;
  locale: "en" | "id";
}): string {
  const whyLabel = opts.locale === "id" ? "Kenapa ini penting" : "Why it matters";
  const fixLabel = opts.locale === "id" ? "Cara Memperbaiki" : "How to Fix";
  const confidenceLabel = opts.locale === "id" ? "Keyakinan" : "Confidence";

  let locationHtml = "";
  if (opts.filePath) {
    const loc = opts.startLine ? `${opts.filePath}:${opts.startLine}` : opts.filePath;
    locationHtml = `<div class="file-path">${escapeHtml(loc)}</div>`;
  } else if (opts.url) {
    locationHtml = `<div class="file-path">${escapeHtml(opts.url)}</div>`;
  }

  let snippetHtml = "";
  if (opts.snippet) {
    snippetHtml = `<div class="snippet-block"><code>${escapeHtml(opts.snippet)}</code></div>`;
  }

  const remediationItems = opts.remediation
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join("");

  const refs: string[] = [];
  for (const cwe of opts.cwes) {
    refs.push(`<span class="ref-tag">${escapeHtml(cwe)}</span>`);
  }
  for (const owasp of opts.owaspRefs) {
    refs.push(`<span class="ref-tag">${escapeHtml(owasp)}</span>`);
  }

  const confidenceDots = ["low", "medium", "high"];
  const activeIdx = confidenceDots.indexOf(opts.confidence);
  const dotsHtml = confidenceDots
    .map((_, i) => `<span class="confidence-dot${i <= activeIdx ? " active" : ""}"></span>`)
    .join("");

  return `<div class="evidence-card">
<div class="evidence-card-header">
<span class="severity-badge ${opts.severity}">${opts.severity.toUpperCase()}</span>
<h3>${escapeHtml(opts.title)}</h3>
<span class="confidence-indicator">${confidenceLabel}: ${dotsHtml} ${opts.confidence}</span>
</div>
${locationHtml}
${snippetHtml}
<div class="why-matters"><strong>${whyLabel}:</strong> ${escapeHtml(opts.whyItMatters)}</div>
<div><strong>${fixLabel}:</strong><ol class="remediation-list">${remediationItems}</ol></div>
${refs.length > 0 ? `<div class="refs">${refs.join("")}</div>` : ""}
</div>`;
}

export function gamificationTemplate(opts: {
  xpEarned: number;
  badges: string[];
  streaks: number;
  locale: "en" | "id";
}): string {
  const title = opts.locale === "id" ? "Gamifikasi" : "Gamification";
  const xpLabel = "XP";
  const badgeLabel = opts.locale === "id" ? "Lencana" : "Badges";
  const streakLabel = "Streak";

  const badgesHtml =
    opts.badges.length > 0
      ? opts.badges.map((b) => escapeHtml(b)).join(", ")
      : opts.locale === "id"
        ? "Belum ada"
        : "None yet";

  return `<section class="gamification-section">
<h2>${title}</h2>
<div class="gamification-stats">
<div class="gamification-stat"><span class="gam-value">+${opts.xpEarned}</span><span class="gam-label">${xpLabel}</span></div>
<div class="gamification-stat"><span class="gam-value">${badgesHtml}</span><span class="gam-label">${badgeLabel}</span></div>
<div class="gamification-stat"><span class="gam-value">${opts.streaks}</span><span class="gam-label">${streakLabel}</span></div>
</div>
</section>`;
}

export function footerTemplate(locale: "en" | "id", timestamp: string): string {
  const text =
    locale === "id"
      ? `Dibuat oleh KodeAman &mdash; Security coach untuk developer Indonesia`
      : `Generated by KodeAman &mdash; Security coach for Indonesian developers`;

  return `<footer class="report-footer">
<p>${text}</p>
<p>${escapeHtml(timestamp)}</p>
</footer>
</div>
</body>
</html>`;
}
