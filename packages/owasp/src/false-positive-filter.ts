import type {
  NormalizedFinding,
  FindingSource,
  ConfidenceLevel,
} from "@aspidasec/schema";

export interface SuppressionPattern {
  /** Glob pattern to match finding rule IDs (e.g. "npm-audit:*") */
  rulePattern?: string;
  /** Glob pattern to match file paths (e.g. "test/**", "*.test.ts") */
  pathPattern?: string;
  /** Reason for suppression */
  reason: string;
}

export interface FalsePositiveFilterConfig {
  /** Minimum confidence level to keep a finding. Findings below this are filtered. Default: "low" */
  confidenceGate?: ConfidenceLevel;
  /** Require at least one evidence block on each finding. Default: false */
  requireEvidence?: boolean;
  /** Boost confidence when finding is corroborated by multiple scanner types (e.g. SAST + DAST). Default: true */
  multiScannerCorrelation?: boolean;
  /** Suppression patterns to exclude known false positives */
  suppressions?: SuppressionPattern[];
}

export interface FalsePositiveFilterResult {
  /** Findings that passed all gates */
  findings: NormalizedFinding[];
  /** Findings that were filtered out */
  filtered: NormalizedFinding[];
  /** Summary report of filtering actions */
  report: FilterReport;
}

export interface FilterReport {
  totalInput: number;
  totalPassed: number;
  totalFiltered: number;
  filteredByConfidence: number;
  filteredByEvidence: number;
  filteredBySuppression: number;
  correlationBoosts: number;
}

const CONFIDENCE_ORDER: Record<ConfidenceLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

function matchGlob(pattern: string, value: string): boolean {
  const regex = new RegExp(
    "^" +
      pattern
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*\*/g, "{{GLOBSTAR}}")
        .replace(/\*/g, "[^/]*")
        .replace(/\?/g, "[^/]")
        .replace(/\{\{GLOBSTAR\}\}/g, ".*") +
      "$",
  );
  return regex.test(value);
}

function getScannerType(source: FindingSource): "sast" | "dast" | "sca" | "other" {
  switch (source) {
    case "semgrep":
    case "codeql":
      return "sast";
    case "zap-baseline":
    case "zap-full":
      return "dast";
    case "npm-audit":
      return "sca";
    default:
      return "other";
  }
}

export class FalsePositiveFilter {
  private config: Required<FalsePositiveFilterConfig>;

  constructor(config: FalsePositiveFilterConfig = {}) {
    this.config = {
      confidenceGate: config.confidenceGate ?? "low",
      requireEvidence: config.requireEvidence ?? false,
      multiScannerCorrelation: config.multiScannerCorrelation ?? true,
      suppressions: config.suppressions ?? [],
    };
  }

  filter(findings: NormalizedFinding[]): FalsePositiveFilterResult {
    const report: FilterReport = {
      totalInput: findings.length,
      totalPassed: 0,
      totalFiltered: 0,
      filteredByConfidence: 0,
      filteredByEvidence: 0,
      filteredBySuppression: 0,
      correlationBoosts: 0,
    };

    // Step 1: Apply multi-scanner correlation boosts
    let boosted: NormalizedFinding[];
    if (this.config.multiScannerCorrelation) {
      const { findings: boostedFindings, boostCount } = this.applyCorrelationBoosts(findings);
      boosted = boostedFindings;
      report.correlationBoosts = boostCount;
    } else {
      boosted = findings;
    }

    const passed: NormalizedFinding[] = [];
    const filtered: NormalizedFinding[] = [];

    for (const finding of boosted) {
      // Step 2: Suppression patterns
      if (this.isSuppressed(finding)) {
        report.filteredBySuppression++;
        filtered.push(finding);
        continue;
      }

      // Step 3: Evidence gate
      if (this.config.requireEvidence && finding.evidence.length === 0) {
        report.filteredByEvidence++;
        filtered.push(finding);
        continue;
      }

      // Step 4: Confidence gate
      if (
        CONFIDENCE_ORDER[finding.confidence] <
        CONFIDENCE_ORDER[this.config.confidenceGate]
      ) {
        report.filteredByConfidence++;
        filtered.push(finding);
        continue;
      }

      passed.push(finding);
    }

    report.totalPassed = passed.length;
    report.totalFiltered = filtered.length;

    return { findings: passed, filtered, report };
  }

  private isSuppressed(finding: NormalizedFinding): boolean {
    for (const suppression of this.config.suppressions) {
      const ruleMatch =
        !suppression.rulePattern ||
        (finding.raw.toolRuleId && matchGlob(suppression.rulePattern, finding.raw.toolRuleId));

      const pathMatch =
        !suppression.pathPattern ||
        (finding.location.filePath && matchGlob(suppression.pathPattern, finding.location.filePath));

      if (ruleMatch && pathMatch) {
        return true;
      }
    }
    return false;
  }

  private applyCorrelationBoosts(
    findings: NormalizedFinding[],
  ): { findings: NormalizedFinding[]; boostCount: number } {
    // Group findings by dedupe key to find overlapping detections
    const byDedupeKey = new Map<string, NormalizedFinding[]>();
    for (const f of findings) {
      const key = f.dedupeKey;
      const group = byDedupeKey.get(key);
      if (group) {
        group.push(f);
      } else {
        byDedupeKey.set(key, [f]);
      }
    }

    // Also group by location (file + line range) for cross-scanner correlation
    const byLocation = new Map<string, NormalizedFinding[]>();
    for (const f of findings) {
      if (f.location.filePath && f.location.startLine) {
        const locKey = `${f.location.filePath}:${f.location.startLine}`;
        const group = byLocation.get(locKey);
        if (group) {
          group.push(f);
        } else {
          byLocation.set(locKey, [f]);
        }
      }
    }

    let boostCount = 0;
    const boosted = findings.map((f) => {
      // Check if this finding has corroboration from a different scanner type
      const locKey =
        f.location.filePath && f.location.startLine
          ? `${f.location.filePath}:${f.location.startLine}`
          : null;

      const correlated = locKey
        ? byLocation.get(locKey) ?? []
        : byDedupeKey.get(f.dedupeKey) ?? [];

      const myType = getScannerType(f.source);
      const hasOtherType = correlated.some(
        (other) => other !== f && getScannerType(other.source) !== myType,
      );

      if (hasOtherType && f.confidence !== "high") {
        boostCount++;
        return {
          ...f,
          confidence: (f.confidence === "low" ? "medium" : "high") as ConfidenceLevel,
          prioritization: {
            ...f.prioritization,
            confidenceScore: Math.min(
              f.prioritization.confidenceScore + 20,
              100,
            ),
            reasons: [
              ...f.prioritization.reasons,
              "Multi-scanner correlation boost (SAST+DAST overlap)",
            ],
          },
        };
      }
      return f;
    });

    return { findings: boosted, boostCount };
  }
}
