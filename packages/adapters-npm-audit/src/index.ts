export { NpmAuditAdapter } from "./adapter.js";
export type { ScannerAdapter } from "./adapter.js";
export type {
  NpmAuditResult,
  NpmVulnerability,
  NpmVulnerabilityVia,
  NpmFixAvailable,
  NpmAuditMetadata,
  NpmAuditScanContext,
} from "./types.js";
export {
  mapSeverity,
  mapConfidence,
  extractCweIds,
  extractCveIds,
  getViaDetails,
  getAdvisoryTitle,
  getAdvisoryUrl,
  generateDedupeKey,
  generateFindingId,
} from "./mapper.js";
