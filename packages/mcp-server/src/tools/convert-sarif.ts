/**
 * kodeaman_convert_sarif — Convert findings to SARIF format.
 *
 * Takes an array of NormalizedFinding objects and converts them
 * to SARIF v2.1.0 for GitHub Code Scanning integration.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { NormalizedFinding } from "@kodeaman/schema";

export function registerConvertSarifTool(server: McpServer): void {
  server.tool(
    "kodeaman_convert_sarif",
    "Convert KodeAman findings to SARIF v2.1.0 format for GitHub Code Scanning, VS Code SARIF Viewer, or other SARIF-compatible tools. Provide findings JSON from a scan result.",
    {
      findings: z
        .string()
        .describe(
          "JSON array of NormalizedFinding objects from a scan result",
        ),
    },
    async ({ findings }) => {
      try {
        const parsed: NormalizedFinding[] = JSON.parse(findings);

        const { SarifConverter } = await import("@kodeaman/output-sarif");
        const converter = new SarifConverter();
        const sarif = converter.convert(parsed);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(sarif, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `SARIF conversion failed: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
