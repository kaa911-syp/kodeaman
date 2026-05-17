import type { Context } from "probot";
import { execSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadConfig } from "@aspidasec/config";
import { MarkdownRenderer } from "@aspidasec/output-markdown";
import type { ScanResult } from "@aspidasec/output-markdown";
import type { SeverityLevel } from "@aspidasec/schema";
import { GitHubCommentManager } from "./comment.js";

export class PRHandler {
  private commentManager = new GitHubCommentManager();

  async handlePullRequest(context: Context<"pull_request">): Promise<void> {
    const pr = context.payload.pull_request;
    const repo = context.repo();
    const cloneUrl = context.payload.repository.clone_url;

    context.log.info(
      `Processing PR #${pr.number} in ${repo.owner}/${repo.repo}`,
    );

    const workDir = mkdtempSync(join(tmpdir(), "aspidasec-"));

    try {
      // Shallow clone the PR branch
      execSync(
        `git clone --depth 1 --branch ${pr.head.ref} ${cloneUrl} ${workDir}`,
        { stdio: "pipe", timeout: 120_000 },
      );

      const config = loadConfig(workDir);
      const isOwaspMode = config.owasp?.enabled === true;

      // Run pipeline
      try {
        const { ScanPipeline } = await import("@aspidasec/core");
        const pipeline = new ScanPipeline(config as never);

        if (isOwaspMode) {
          // OWASP mode: use OwaspScanOrchestrator
          const { OwaspScanOrchestrator } = await import("@aspidasec/owasp");
          const orchestrator = new OwaspScanOrchestrator(pipeline, config);

          const owaspResult = await orchestrator.scan(
            {
              repoRoot: workDir,
              provider: "github",
              branch: pr.head.ref,
              commitSha: pr.head.sha,
              prNumber: pr.number,
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
            repoName: `${repo.owner}/${repo.repo}`,
            branch: pr.head.ref,
            commitSha: pr.head.sha,
          };

          const renderer = new MarkdownRenderer();
          const markdown = renderer.renderPRComment(result, config);

          await this.commentManager.createOrUpdateComment(
            context,
            pr.number,
            markdown,
          );

          // Generate HTML report as artifact if html output enabled
          if (config.output.html) {
            try {
              const { HtmlReportGenerator, DEFAULT_REPORT_CONFIG } = await import(
                "@aspidasec/output-html"
              );
              const generator = new HtmlReportGenerator();
              const html = generator.generateReport(
                {
                  scanId: `owasp-pr-${pr.number}`,
                  startedAt: new Date(Date.now() - owaspResult.scanDurationMs).toISOString(),
                  completedAt: new Date().toISOString(),
                  environment: owaspResult.environment.platform,
                  repoContext: {
                    repoFullName: `${repo.owner}/${repo.repo}`,
                    branch: pr.head.ref,
                    commitSha: pr.head.sha,
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

              const htmlPath = join(workDir, "aspidasec-owasp-report.html");
              writeFileSync(htmlPath, html, "utf-8");
              context.log.info(`OWASP HTML report generated at ${htmlPath}`);
            } catch (htmlErr) {
              context.log.warn("Failed to generate HTML report: %s", (htmlErr as Error).message);
            }
          }

          context.log.info(`Posted OWASP security report to PR #${pr.number}`);
        } else {
          // Standard scan mode
          const pipelineResult = await pipeline.run({
            repoRoot: workDir,
            provider: "github",
            branch: pr.head.ref,
            commitSha: pr.head.sha,
            prNumber: pr.number,
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
            repoName: `${repo.owner}/${repo.repo}`,
            branch: pr.head.ref,
            commitSha: pr.head.sha,
          };

          const renderer = new MarkdownRenderer();
          const markdown = renderer.renderPRComment(result, config);

          await this.commentManager.createOrUpdateComment(
            context,
            pr.number,
            markdown,
          );

          context.log.info(`Posted security report to PR #${pr.number}`);
        }
      } catch (err) {
        context.log.error("Pipeline execution failed: %s", (err as Error).message);
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
