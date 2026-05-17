/**
 * aspidasec_list_scanners — List available security scanners.
 *
 * Quick check that returns which scanners are installed and their versions.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerListScannersTool(server: McpServer): void {
  server.tool(
    "aspidasec_list_scanners",
    "List all security scanners that AspidaSec supports and whether they are currently installed and available on the system PATH. Returns scanner name, availability status, version, and path.",
    {},
    async () => {
      try {
        const { detectScanners } = await import("@aspidasec/owasp");
        const scanners = detectScanners();

        const response = {
          scanners: scanners.map((s) => ({
            name: s.name,
            source: s.source,
            available: s.available,
            version: s.version ?? null,
            path: s.path ?? null,
          })),
          summary: {
            total: scanners.length,
            available: scanners.filter((s) => s.available).length,
            missing: scanners.filter((s) => !s.available).map((s) => s.name),
          },
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
              text: `Failed to list scanners: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
