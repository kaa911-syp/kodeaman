// Types
export type { OwaspCategoryDefinition, CweMapping } from "./types.js";

// Category data
export {
  OWASP_CATEGORIES,
  OWASP_BY_ID,
  OWASP_BY_CODE,
  CWE_TO_OWASP,
  getAllCategoryIds,
  getCategoryById,
  type OwaspCategoryId,
} from "./categories.js";

// Mapper functions
export {
  mapCweToOwasp,
  mapFindingToOwasp,
  getOwaspDefinition,
  findingMatchesCategory,
} from "./mapper.js";

// Orchestrator
export {
  OwaspScanOrchestrator,
  type OwaspScanOptions,
} from "./orchestrator.js";

// Environment detection
export {
  detectWSL,
  checkWSLAvailability,
  getWSLInstallInstructions,
  detectScanners,
  detectEnvironment,
  type ScannerInfo,
  type EnvironmentInfo,
  type WSLInstallInstructions,
} from "./environment.js";

// Progress reporter
export { OwaspProgressReporter } from "./progress.js";

// False positive filter
export {
  FalsePositiveFilter,
  type FalsePositiveFilterConfig,
  type FalsePositiveFilterResult,
  type FilterReport,
  type SuppressionPattern,
} from "./false-positive-filter.js";
