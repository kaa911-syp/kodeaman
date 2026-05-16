import type { NormalizedFinding, RepoContext } from "@kodeaman/schema";
import type { SemgrepRawOutput, SemgrepResult, ScanContext } from "./types.js";
import {
  mapSeverity,
  mapConfidence,
  mapCategory,
  mapSurface,
  generateDedupeKey,
  generateFindingId,
} from "./mapper.js";

export interface ScannerAdapter {
  readonly name: string;
  scan(context: ScanContext, repoContext?: RepoContext): Promise<NormalizedFinding[]>;
}

export class SemgrepAdapter implements ScannerAdapter {
  readonly name = "semgrep";

  async scan(context: ScanContext, repoContext?: RepoContext): Promise<NormalizedFinding[]> {
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const execFileAsync = promisify(execFile);

    const args = ["--json", "--quiet"];

    if (context.configPath) {
      args.push("--config", context.configPath);
    } else if (context.rules && context.rules.length > 0) {
      for (const rule of context.rules) {
        args.push("--config", rule);
      }
    } else {
      args.push("--config", "auto");
    }

    if (context.extraArgs) {
      args.push(...context.extraArgs);
    }

    args.push(context.targetPath);

    try {
      const { stdout } = await execFileAsync("semgrep", args, {
        timeout: context.timeout ?? 300_000,
        maxBuffer: 50 * 1024 * 1024,
      });

      const raw: SemgrepRawOutput = JSON.parse(stdout);
      return this.parseSemgrepOutput(raw, repoContext);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "stdout" in error) {
        const stdout = (error as { stdout: string }).stdout;
        if (stdout) {
          try {
            const raw: SemgrepRawOutput = JSON.parse(stdout);
            return this.parseSemgrepOutput(raw, repoContext);
          } catch {
            // parse failed, rethrow original
          }
        }
      }
      throw error;
    }
  }

  parseSemgrepOutput(raw: SemgrepRawOutput, repoContext?: RepoContext): NormalizedFinding[] {
    return raw.results
      .filter((r) => !r.extra.is_ignored)
      .map((result) => this.mapResult(result, repoContext));
  }

  private mapResult(result: SemgrepResult, repoContext?: RepoContext): NormalizedFinding {
    const severity = mapSeverity(result.extra.severity);
    const confidence = mapConfidence(result.extra.metadata);
    const category = mapCategory(result.extra.metadata);

    return {
      schemaVersion: "1.0.0",
      findingId: generateFindingId(result),
      dedupeKey: generateDedupeKey(result),
      source: "semgrep",
      category,
      surface: mapSurface(result.extra.metadata),

      severity,
      confidence,
      status: "open",

      title: result.check_id.split(".").pop() ?? result.check_id,
      description: result.extra.message,

      location: {
        filePath: result.path,
        startLine: result.start.line,
        endLine: result.end.line,
        startColumn: result.start.col,
        endColumn: result.end.col,
        snippet: result.extra.lines,
      },

      evidence: [
        {
          type: "code",
          label: "Matched code",
          content: result.extra.lines,
        },
      ],

      classification: {
        cwe: result.extra.metadata.cwe,
        owasp: result.extra.metadata.owasp,
        tags: result.extra.metadata.technology,
      },

      raw: {
        tool: "semgrep",
        toolRuleId: result.check_id,
        toolFindingId: generateFindingId(result),
        rawSeverity: result.extra.severity,
        rawConfidence: result.extra.metadata.confidence,
        rawCategory: result.extra.metadata.category,
      },

      repoContext,

      prioritization: {
        baseSeverity: severity,
        adjustedSeverity: severity,
        priorityScore: 0,
        confidenceScore: confidence === "high" ? 90 : confidence === "medium" ? 60 : 30,
        reasons: [],
      },

      coaching: {
        titleEn: result.check_id.split(".").pop() ?? result.check_id,
        titleId: result.check_id.split(".").pop() ?? result.check_id,
        summaryEn: result.extra.message,
        summaryId: result.extra.message,
        whyItMattersEn: "",
        whyItMattersId: "",
        remediationEn: [],
        remediationId: [],
      },

      gamification: {
        issueFamily: category,
      },

      detectedAt: new Date().toISOString(),
    };
  }
}
