/**
 * kodeaman_scan — Run security scan on a project directory.
 *
 * Executes the KodeAman ScanPipeline with all configured adapters
 * and returns deduplicated, prioritized findings.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { buildPipeline, loadProjectConfig } from "../pipeline-helper.js";

export function registerScanTool(server: McpServer): void {
  server.tool(
    "kodeaman_scan",
    "Run a security scan on a project directory. Returns deduplicated findings sorted by priority with coaching content, OWASP classification, and fix suggestions.",
    {
      repoRoot: z
        .string()
        .describe(
          "Absolute path to the project root directory to scan",
        ),
      language: z
        .enum(["en", "id"])
        .optional()
        .describe(
          "Output language: 'en' for English, 'id' for Indonesian (Bahasa). Defaults to config setting.",
        ),
      format: z
        .enum(["json", "markdown", "sarif"])
        .optional()
        .describe(
          "Output format for the findings. Defaults to 'json'.",
        ),
      scanners: z
        .object({
          semgrep: z.boolean().optional(),
          zapBaseline: z.boolean().optional(),
          npmAudit: z.boolean().optional(),
          playwright: z.boolean().optional(),
        })
        .optional()
        .describe(
          "Override which scanners to enable. Omitted scanners use config defaults.",
        ),
    },
    async ({ repoRoot, language, format, scanners }) => {
      try {
        const config = loadProjectConfig(repoRoot);

        if (language) {
          config.language = language;
        }

        // Apply scanner overrides
        if (scanners) {
          if (scanners.semgrep !== undefined)
            config.scanners.semgrep = scanners.semgrep;
          if (scanners.zapBaseline !== undefined)
            config.scanners.zapBaseline = scanners.zapBaseline;
          if (scanners.npmAudit !== undefined)
            config.scanners.npmAudit = scanners.npmAudit;
          if (scanners.playwright !== undefined)
            config.scanners.playwright = scanners.playwright;
        }

        // Run preflight to warn about missing scanners
        const { preflightCheck } = await import("@kodeaman/owasp");
        const preflight = preflightCheck(config.language);

        const pipeline = await buildPipeline(config);

        const result = await pipeline.run({
          repoRoot,
          provider: "local",
        });

        // Build response based on format
        if (format === "sarif") {
          const { SarifConverter } = await import("@kodeaman/output-sarif");
          const converter = new SarifConverter();
          const sarif = converter.convert(result.findings);
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(sarif, null, 2),
              },
            ],
          };
        }

        if (format === "markdown") {
          const { MarkdownRenderer } = await import(
            "@kodeaman/output-markdown"
          );
          const mdRenderer = new MarkdownRenderer();

          const bySeverity = { info: 0, low: 0, medium: 0, high: 0, critical: 0 };
          for (const f of result.findings) {
            bySeverity[f.severity]++;
          }

          const mdResult = {
            findings: result.findings,
            summary: {
              totalFindings: result.findings.length,
              bySeverity,
              scanDurationMs: result.timing.durationMs,
              scannersUsed: [
                ...new Set(result.findings.map((f) => f.source)),
              ],
            },
          };

          return {
            content: [
              {
                type: "text" as const,
                text: mdRenderer.renderPRComment(mdResult, config),
              },
            ],
          };
        }

        // Default: JSON
        const response = {
          totalFindings: result.findings.length,
          summary: result.summary,
          timing: result.timing,
          coverageReport: result.coverageReport,
          preflightWarnings: preflight.warnings,
          findings: result.findings,
        };

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Scan failed: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
