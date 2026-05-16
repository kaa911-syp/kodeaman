export { SemgrepAdapter } from "./adapter.js";
export type { ScannerAdapter } from "./adapter.js";
export type { SemgrepRawOutput, SemgrepResult, SemgrepExtra, SemgrepPosition, SemgrepError, ScanContext } from "./types.js";
export { mapSeverity, mapConfidence, mapCategory, mapSurface, generateDedupeKey, generateFindingId } from "./mapper.js";
