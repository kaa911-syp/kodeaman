export { ScanPipeline } from "./pipeline.js";
export { deduplicateFindings } from "./dedup.js";
export {
  SCANNER_OWASP_COVERAGE,
  SCANNER_SURFACE_COVERAGE,
  buildCoverageReport,
} from "./coverage.js";
export type {
  ScannerAdapter,
  ScanContext,
  ScanResult,
  ScanSummary,
  TimingInfo,
  ScannerCoverage,
  CoverageReport,
  KodeamanConfig,
  PrioritizationConfig,
  GamificationConfig,
  OutputConfig,
} from "./types.js";
