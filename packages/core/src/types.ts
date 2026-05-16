import type {
  NormalizedFinding,
  SeverityLevel,
  FindingCategory,
} from "@kodeaman/schema";

export interface ScannerAdapter {
  name: string;
  scan(context: ScanContext): Promise<NormalizedFinding[]>;
}

export interface ScanContext {
  repoRoot: string;
  branch?: string;
  commitSha?: string;
  prNumber?: number;
  mrIid?: number;
  provider?: "github" | "gitlab" | "local";
  configPath?: string;
  owaspCategory?: string;
}

export interface ScanSummary {
  total: number;
  bySeverity: Record<SeverityLevel, number>;
  byCategory: Partial<Record<FindingCategory, number>>;
  topFindings: NormalizedFinding[];
  xpEarned: number;
  badgesAwarded: string[];
}

export interface TimingInfo {
  startedAt: string;
  completedAt: string;
  durationMs: number;
  adapterTimings: Record<string, number>;
}

export interface ScanResult {
  findings: NormalizedFinding[];
  summary: ScanSummary;
  timing: TimingInfo;
}

export interface PrioritizationConfig {
  maxFindingsInComment?: number;
  failOnSeverity?: SeverityLevel;
}

export interface GamificationConfig {
  enabled?: boolean;
}

export interface OutputConfig {
  markdown?: boolean;
  sarif?: boolean;
}

export interface KodeamanConfig {
  language?: "id" | "en";
  scanners?: Record<string, boolean>;
  presets?: string[];
  prioritization?: PrioritizationConfig;
  gamification?: GamificationConfig;
  output?: OutputConfig;
}
