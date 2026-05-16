import { execSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadConfig } from "@kodeaman/config";
import { MarkdownRenderer } from "@kodeaman/output-markdown";
import type { ScanResult } from "@kodeaman/output-markdown";
import type { SeverityLevel } from "@kodeaman/schema";
import { GitLabCommentManager } from "./comment.js";

interface MergeRequestEvent {
  object_kind: "merge_request";
  project: {
    id: number;
    git_http_url: string;
    path_with_namespace: string;
  };
  object_attributes: {
    iid: number;
    source_branch: string;
    last_commit: {
      id: string;
    };
    action: string;
  };
}

export class MRHandler {
  private commentManager = new GitLabCommentManager();

  async handleMergeRequest(event: MergeRequestEvent): Promise<void> {
    const { project, object_attributes: mr } = event;

    console.log(
      `Processing MR !${mr.iid} in ${project.path_with_namespace}`,
    );

    const workDir = mkdtempSync(join(tmpdir(), "kodeaman-"));

    try {
      execSync(
        `git clone --depth 1 --branch ${mr.source_branch} ${project.git_http_url} ${workDir}`,
        { stdio: "pipe", timeout: 120_000 },
      );

      const config = loadConfig(workDir);
      const isOwaspMode = config.owasp?.enabled === true;

      try {
        const { ScanPipeline } = await import("@kodeaman/core");
        const pipeline = new ScanPipeline(config as never);

        if (isOwaspMode) {
          // OWASP mode: use OwaspScanOrchestrator
          const { OwaspScanOrchestrator } = await import("@kodeaman/owasp");
          const orchestrator = new OwaspScanOrchestrator(pipeline, config);

          const owaspResult = await orchestrator.scan(
            {
              repoRoot: workDir,
              provider: "gitlab",
              branch: mr.source_branch,
              commitSha: mr.last_commit.id,
              mrIid: mr.iid,
            },
            {
              categories: config.owasp?.categories as never,
              parallel: config.owasp?.parallel,
              confidenceGate: config.owasp?.confidenceGate,
              evidenceGate: config.owasp?.evidenceGate,
              locale: config.language,
            },
          );

          const allFindings = owaspResult.phases.flatMap((p) => p.findings);

          const bySeverity: Record<SeverityLevel, number> = {
            info: 0, low: 0, medium: 0, high: 0, critical: 0,
          };
          for (const f of allFindings) {
            bySeverity[f.severity]++;
          }

          const result: ScanResult = {
            findings: allFindings,
            summary: {
              totalFindings: allFindings.length,
              bySeverity,
              scanDurationMs: owaspResult.scanDurationMs,
              scannersUsed: [...new Set(owaspResult.phases.flatMap((p) => p.scannersUsed))],
            },
            repoName: project.path_with_namespace,
            branch: mr.source_branch,
            commitSha: mr.last_commit.id,
          };

          const renderer = new MarkdownRenderer();
          const markdown = renderer.renderPRComment(result, config);

          await this.commentManager.createOrUpdateNote(
            project.id,
            mr.iid,
            markdown,
          );

          // Generate HTML report as artifact if html output enabled
          if (config.output.html) {
            try {
              const { HtmlReportGenerator, DEFAULT_REPORT_CONFIG } = await import(
                "@kodeaman/output-html"
              );
              const generator = new HtmlReportGenerator();
              const html = generator.generateReport(
                {
                  scanId: `owasp-mr-${mr.iid}`,
                  startedAt: new Date(Date.now() - owaspResult.scanDurationMs).toISOString(),
                  completedAt: new Date().toISOString(),
                  environment: owaspResult.environment.platform,
                  repoContext: {
                    repoFullName: project.path_with_namespace,
                    branch: mr.source_branch,
                    commitSha: mr.last_commit.id,
                  },
                  categories: owaspResult.phases.map((phase) => ({
                    categoryId: phase.owaspCode,
                    findings: phase.findings,
                  })),
                  totalFindings: owaspResult.totalFindings,
                  bySeverity,
                  scannersUsed: [...new Set(owaspResult.phases.flatMap((p) => p.scannersUsed))],
                },
                {
                  ...DEFAULT_REPORT_CONFIG,
                  locale: config.language,
                  gamificationEnabled: config.gamification.enabled,
                },
              );

              const htmlPath = join(workDir, "kodeaman-owasp-report.html");
              writeFileSync(htmlPath, html, "utf-8");
              console.log(`OWASP HTML report generated at ${htmlPath}`);
            } catch (htmlErr) {
              console.warn("Failed to generate HTML report:", htmlErr);
            }
          }

          console.log(`Posted OWASP security report to MR !${mr.iid}`);
        } else {
          // Standard scan mode
          const pipelineResult = await pipeline.run({
            repoRoot: workDir,
            provider: "gitlab",
            branch: mr.source_branch,
            commitSha: mr.last_commit.id,
            mrIid: mr.iid,
          });

          const bySeverity: Record<SeverityLevel, number> = {
            info: 0, low: 0, medium: 0, high: 0, critical: 0,
          };
          for (const f of pipelineResult.findings) {
            bySeverity[f.severity]++;
          }

          const result: ScanResult = {
            findings: pipelineResult.findings,
            summary: {
              totalFindings: pipelineResult.findings.length,
              bySeverity,
              scanDurationMs: pipelineResult.timing.durationMs,
              scannersUsed: Object.keys(pipelineResult.timing.adapterTimings),
            },
            repoName: project.path_with_namespace,
            branch: mr.source_branch,
            commitSha: mr.last_commit.id,
          };

          const renderer = new MarkdownRenderer();
          const markdown = renderer.renderPRComment(result, config);

          await this.commentManager.createOrUpdateNote(
            project.id,
            mr.iid,
            markdown,
          );

          console.log(`Posted security report to MR !${mr.iid}`);
        }
      } catch (err) {
        console.error("Pipeline execution failed:", err);
      }
    } finally {
      try {
        rmSync(workDir, { recursive: true, force: true });
      } catch {
        // cleanup failure is non-fatal
      }
    }
  }
}
