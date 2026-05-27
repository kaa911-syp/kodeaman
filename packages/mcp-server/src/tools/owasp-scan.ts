/**
 * aspidasec_owasp_scan — Run OWASP Top 10 security scan with evidence reports.
 *
 * Executes a structured OWASP Top 10 scan, running each category
 * independently and returning per-category findings with evidence.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { buildPipeline, loadProjectConfig } from "../pipeline-helper.js";

export function registerOwaspScanTool(server: McpServer): void {
  server.tool(
    "aspidasec_owasp_scan",
    "Run an OWASP Top 10 security scan with evidence reports. Scans each OWASP category independently and returns structured findings with coaching, remediation, and OWASP classification.",
    {
      repoRoot: z
        .string()
        .describe("Absolute path to the project root directory to scan"),
      language: z
        .enum(["en"])
        .optional()
        .describe("Output language: 'en' for English"),
      categories: z
        .array(z.string())
        .optional()
        .describe(
          "OWASP categories to scan, e.g. ['A01','A03','A06']. Defaults to all 10.",
        ),
      parallel: z
        .boolean()
        .optional()
        .describe("Run category scans in parallel. Defaults to false."),
      confidenceGate: z
        .enum(["low", "medium", "high"])
        .optional()
        .describe("Minimum confidence level for findings. Defaults to 'low'."),
      format: z
        .enum(["json", "sarif", "markdown"])
        .optional()
        .describe("Output format. Defaults to 'json'."),
    },
    async ({
      repoRoot,
      language,
      categories,
      parallel,
      confidenceGate,
      format,
    }) => {
      try {
        const config = loadProjectConfig(repoRoot);

        if (language) {
          config.language = language;
        }

        const pipeline = await buildPipeline(config);

        const { OwaspScanOrchestrator } = await import("@aspidasec/owasp");
        const orchestrator = new OwaspScanOrchestrator(pipeline, config);

        const owaspCategories =
          categories ?? config.owasp?.categories ?? [
            "A01", "A02", "A03", "A04", "A05",
            "A06", "A07", "A08", "A09", "A10",
          ];

        const scanResult = await orchestrator.scan(
          {
            repoRoot,
            provider: "local",
          },
          {
            parallel: parallel ?? config.owasp?.parallel ?? false,
            categories: owaspCategories as never,
            confidenceGate:
              confidenceGate ?? config.owasp?.confidenceGate ?? "low",
            evidenceGate: config.owasp?.evidenceGate ?? true,
            locale: config.language,
          },
        );

        const allFindings = scanResult.phases.flatMap((p) => p.findings);

        // Format output
        if (format === "sarif") {
          const { SarifConverter } = await import("@aspidasec/output-sarif");
          const converter = new SarifConverter();
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(
                  converter.convert(allFindings),
                  null,
                  2,
                ),
              },
            ],
          };
        }

        if (format === "markdown") {
          const { MarkdownRenderer } = await import(
            "@aspidasec/output-markdown"
          );
          const mdRenderer = new MarkdownRenderer();
          const bySeverity = { info: 0, low: 0, medium: 0, high: 0, critical: 0 };
          for (const f of allFindings) {
            bySeverity[f.severity]++;
          }

          const mdResult = {
            findings: allFindings,
            summary: {
              totalFindings: allFindings.length,
              bySeverity,
              scanDurationMs: scanResult.scanDurationMs,
              scannersUsed: [
                ...new Set(
                  scanResult.phases.flatMap((p) => p.scannersUsed),
                ),
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

        // Default JSON — include full structured result
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(scanResult, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `OWASP scan failed: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
