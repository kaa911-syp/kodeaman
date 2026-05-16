import type { NormalizedFinding, RepoContext } from "@kodeaman/schema";
import type { ZapRawReport, ZapAlert, ZapAlertInstance, ZapScanContext } from "./types.js";
import {
  mapRiskCode,
  mapZapConfidence,
  mapZapCategory,
  mapWascToOwasp,
  generateDedupeKey,
  generateFindingId,
} from "./mapper.js";

export interface ScannerAdapter {
  readonly name: string;
  scan(context: ZapScanContext, repoContext?: RepoContext): Promise<NormalizedFinding[]>;
}

export class ZapBaselineAdapter implements ScannerAdapter {
  readonly name = "zap-baseline";

  async scan(context: ZapScanContext, repoContext?: RepoContext): Promise<NormalizedFinding[]> {
    if (context.reportPath) {
      const { readFile } = await import("node:fs/promises");
      const content = await readFile(context.reportPath, "utf-8");
      const raw: ZapRawReport = JSON.parse(content);
      return this.parseZapOutput(raw, repoContext);
    }

    if (!context.targetUrl) {
      throw new Error("Either reportPath or targetUrl must be provided");
    }

    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    const { readFile } = await import("node:fs/promises");
    const execFileAsync = promisify(execFile);

    const reportFile = join(tmpdir(), `zap-report-${Date.now()}.json`);
    const args = [
      "-t", context.targetUrl,
      "-J", reportFile,
    ];

    if (context.configPath) {
      args.push("-c", context.configPath);
    }

    if (context.extraArgs) {
      args.push(...context.extraArgs);
    }

    try {
      await execFileAsync("zap-baseline.py", args, {
        timeout: context.timeout ?? 600_000,
        maxBuffer: 50 * 1024 * 1024,
      });
    } catch (error: unknown) {
      // ZAP returns non-zero exit codes for findings, which is expected
      if (error && typeof error === "object" && "code" in error) {
        const code = (error as { code: number }).code;
        // exit code 1 = WARN_NEW, 2 = FAIL_NEW, 3 = FAIL_INPROG - all produce valid reports
        if (code > 3) throw error;
      } else {
        throw error;
      }
    }

    const content = await readFile(reportFile, "utf-8");
    const raw: ZapRawReport = JSON.parse(content);
    return this.parseZapOutput(raw, repoContext);
  }

  parseZapOutput(raw: ZapRawReport, repoContext?: RepoContext): NormalizedFinding[] {
    const findings: NormalizedFinding[] = [];

    for (const site of raw.site) {
      for (const alert of site.alerts) {
        for (const instance of alert.instances) {
          findings.push(this.mapAlertInstance(alert, instance, site["@name"], repoContext));
        }
      }
    }

    return findings;
  }

  private mapAlertInstance(
    alert: ZapAlert,
    instance: ZapAlertInstance,
    siteName: string,
    repoContext?: RepoContext,
  ): NormalizedFinding {
    const severity = mapRiskCode(alert.riskcode);
    const confidence = mapZapConfidence(alert.confidence);
    const category = mapZapCategory(alert);

    const evidenceBlocks = [];
    if (instance.evidence) {
      evidenceBlocks.push({
        type: "scanner-message" as const,
        label: "Evidence",
        content: instance.evidence,
      });
    }
    if (instance.attack) {
      evidenceBlocks.push({
        type: "http-request" as const,
        label: "Attack payload",
        content: instance.attack,
      });
    }
    if (alert.otherinfo) {
      evidenceBlocks.push({
        type: "scanner-message" as const,
        label: "Additional info",
        content: alert.otherinfo,
      });
    }

    return {
      schemaVersion: "1.0.0",
      findingId: generateFindingId(alert, instance),
      dedupeKey: generateDedupeKey(alert, instance),
      source: "zap-baseline",
      category,
      surface: "web-page",

      severity,
      confidence,
      status: "open",

      title: alert.name,
      description: stripHtml(alert.desc),

      location: {
        url: instance.uri,
        httpMethod: instance.method,
        parameter: instance.param || undefined,
        component: siteName,
      },

      evidence: evidenceBlocks,

      classification: {
        cwe: alert.cweid && alert.cweid !== "-1" ? [`CWE-${alert.cweid}`] : undefined,
        owasp: alert.wascid ? mapWascToOwasp(alert.wascid) : undefined,
      },

      raw: {
        tool: "zap-baseline",
        toolRuleId: alert.pluginid,
        toolFindingId: alert.alertRef,
        rawSeverity: alert.riskdesc,
        rawConfidence: alert.confidence,
        rawCategory: alert.alert,
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
        titleEn: alert.name,
        titleId: alert.name,
        summaryEn: stripHtml(alert.desc),
        summaryId: stripHtml(alert.desc),
        whyItMattersEn: "",
        whyItMattersId: "",
        remediationEn: alert.solution ? [stripHtml(alert.solution)] : [],
        remediationId: alert.solution ? [stripHtml(alert.solution)] : [],
      },

      gamification: {
        issueFamily: category,
      },

      detectedAt: new Date().toISOString(),
    };
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}
