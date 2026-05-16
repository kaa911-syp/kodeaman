import type { KodeamanConfig } from "./types.js";

export const DEFAULT_CONFIG: KodeamanConfig = {
  language: "id",
  scanners: {
    semgrep: true,
    zapBaseline: false,
    npmAudit: false,
  },
  presets: [],
  prioritization: {
    maxFindingsInComment: 3,
    failOnSeverity: "critical",
  },
  gamification: {
    enabled: true,
  },
  output: {
    markdown: true,
    sarif: false,
    json: false,
    html: false,
  },
  owasp: {
    enabled: false,
    categories: ["A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10"],
    parallel: false,
    confidenceGate: "low",
    evidenceGate: true,
    failOnSeverity: "high",
  },
  environment: {
    skipWslCheck: false,
    scannerTimeout: 120_000,
  },
};
