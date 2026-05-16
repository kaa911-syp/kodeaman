const SEVERITY_COLORS = {
  critical: "#dc2626",
  high: "#ea580c",
  medium: "#ca8a04",
  low: "#2563eb",
  info: "#6b7280",
} as const;

export function getStyles(): string {
  return `
    :root {
      --color-critical: ${SEVERITY_COLORS.critical};
      --color-high: ${SEVERITY_COLORS.high};
      --color-medium: ${SEVERITY_COLORS.medium};
      --color-low: ${SEVERITY_COLORS.low};
      --color-info: ${SEVERITY_COLORS.info};
      --bg-primary: #ffffff;
      --bg-secondary: #f9fafb;
      --bg-card: #ffffff;
      --text-primary: #111827;
      --text-secondary: #4b5563;
      --text-muted: #9ca3af;
      --border-color: #e5e7eb;
      --shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg-primary: #111827;
        --bg-secondary: #1f2937;
        --bg-card: #1f2937;
        --text-primary: #f9fafb;
        --text-secondary: #d1d5db;
        --text-muted: #6b7280;
        --border-color: #374151;
        --shadow: 0 1px 3px rgba(0,0,0,0.3);
      }
    }

    [data-theme="light"] {
      --bg-primary: #ffffff;
      --bg-secondary: #f9fafb;
      --bg-card: #ffffff;
      --text-primary: #111827;
      --text-secondary: #4b5563;
      --text-muted: #9ca3af;
      --border-color: #e5e7eb;
      --shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    [data-theme="dark"] {
      --bg-primary: #111827;
      --bg-secondary: #1f2937;
      --bg-card: #1f2937;
      --text-primary: #f9fafb;
      --text-secondary: #d1d5db;
      --text-muted: #6b7280;
      --border-color: #374151;
      --shadow: 0 1px 3px rgba(0,0,0,0.3);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      padding: 0;
    }

    .report-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }

    .report-header {
      text-align: center;
      padding: 2rem 0;
      border-bottom: 2px solid var(--border-color);
      margin-bottom: 2rem;
    }

    .report-header h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .report-header .logo-text {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .report-meta {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 1rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .report-meta span {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .summary-bar {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin: 1.5rem 0;
    }

    .summary-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem 1.5rem;
      background: var(--bg-secondary);
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
      min-width: 100px;
    }

    .summary-stat .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
    }

    .summary-stat .stat-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
    }

    .owasp-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.75rem;
      margin: 1.5rem 0;
    }

    .owasp-cell {
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
      background: var(--bg-card);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }

    .owasp-cell .owasp-id {
      font-weight: 600;
      font-size: 0.8rem;
    }

    .owasp-cell .owasp-count {
      font-weight: 700;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      color: #fff;
    }

    .category-section {
      margin: 2rem 0;
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      overflow: hidden;
    }

    .category-header {
      padding: 1rem 1.5rem;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .category-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .category-header .severity-breakdown {
      display: flex;
      gap: 0.5rem;
    }

    .severity-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.125rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #fff;
    }

    .severity-badge.critical { background: var(--color-critical); }
    .severity-badge.high { background: var(--color-high); }
    .severity-badge.medium { background: var(--color-medium); }
    .severity-badge.low { background: var(--color-low); }
    .severity-badge.info { background: var(--color-info); }

    .evidence-card {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    .evidence-card:last-child {
      border-bottom: none;
    }

    .evidence-card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }

    .evidence-card-header h3 {
      font-size: 1rem;
      font-weight: 600;
    }

    .evidence-card .file-path {
      font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
      font-size: 0.8rem;
      color: var(--text-secondary);
      background: var(--bg-secondary);
      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
      display: inline-block;
      margin-bottom: 0.75rem;
    }

    .evidence-card .snippet-block {
      background: #1e293b;
      color: #e2e8f0;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin: 0.75rem 0;
      font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
      font-size: 0.8rem;
      line-height: 1.5;
    }

    .evidence-card .snippet-block code {
      white-space: pre;
    }

    .evidence-card .why-matters {
      margin: 0.75rem 0;
      padding: 0.75rem 1rem;
      border-left: 3px solid var(--color-medium);
      background: var(--bg-secondary);
      border-radius: 0 0.25rem 0.25rem 0;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .evidence-card .remediation-list {
      margin: 0.75rem 0;
      padding-left: 1.5rem;
      font-size: 0.875rem;
    }

    .evidence-card .remediation-list li {
      margin-bottom: 0.25rem;
    }

    .evidence-card .refs {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 0.75rem;
    }

    .ref-tag {
      display: inline-flex;
      align-items: center;
      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.7rem;
      font-weight: 500;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
    }

    .confidence-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .confidence-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--text-muted);
    }

    .confidence-dot.active { background: #22c55e; }

    .gamification-section {
      margin: 2rem 0;
      padding: 1.5rem;
      background: linear-gradient(135deg, var(--bg-secondary), var(--bg-card));
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      text-align: center;
    }

    .gamification-section h2 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }

    .gamification-stats {
      display: flex;
      gap: 2rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .gamification-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .gamification-stat .gam-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #7c3aed;
    }

    .gamification-stat .gam-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--text-secondary);
    }

    .report-footer {
      text-align: center;
      padding: 2rem 0;
      margin-top: 2rem;
      border-top: 1px solid var(--border-color);
      color: var(--text-muted);
      font-size: 0.8rem;
    }

    @media print {
      body { background: #fff; color: #000; }
      .report-container { max-width: 100%; padding: 1rem; }
      .owasp-grid { grid-template-columns: repeat(5, 1fr); }
      .evidence-card .snippet-block { background: #f1f5f9; color: #1e293b; border: 1px solid #e2e8f0; }
      .severity-badge { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .owasp-cell .owasp-count { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .category-section { break-inside: avoid; }
      .evidence-card { break-inside: avoid; }
    }

    @media (max-width: 640px) {
      .report-container { padding: 1rem; }
      .report-header h1 { font-size: 1.5rem; }
      .report-header .logo-text { font-size: 1.75rem; }
      .owasp-grid { grid-template-columns: repeat(2, 1fr); }
      .summary-bar { flex-direction: column; align-items: center; }
      .category-header { flex-direction: column; align-items: flex-start; }
    }
  `;
}
