/**
 * kodeaman_preflight — Check environment readiness for scanning.
 *
 * Detects platform, WSL status, available scanners, and provides
 * actionable install instructions for missing tools.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerPreflightTool(server: McpServer): void {
  server.tool(
    "kodeaman_preflight",
    "Check if the environment is ready for security scanning. Detects available scanners (semgrep, ZAP, npm-audit), WSL status on Windows, and provides bilingual install instructions for missing tools.",
    {
      language: z
        .enum(["en", "id"])
        .optional()
        .describe("Language for install instructions: 'en' or 'id'. Defaults to 'en'."),
    },
    async ({ language }) => {
      try {
        const locale = language ?? "en";
        const {
          preflightCheck,
          detectEnvironment,
          checkWSLAvailability,
          getWSLInstallInstructions,
        } = await import("@kodeaman/owasp");

        const environment = detectEnvironment();
        const preflight = preflightCheck(locale, environment);

        // On Windows, also check WSL availability
        let wslInfo: {
          available: boolean;
          distros: string[];
          installInstructions?: { title: string; steps: string[]; note: string };
        } | undefined;

        if (environment.platform === "windows") {
          const wsl = checkWSLAvailability();
          wslInfo = {
            available: wsl.available,
            distros: wsl.distros,
          };
          if (!wsl.available) {
            wslInfo.installInstructions = getWSLInstallInstructions(locale);
          }
        }

        const response = {
          canRun: preflight.canRun,
          environment: {
            platform: environment.platform,
            isWSL: environment.isWSL,
            wslDistro: environment.wslDistro,
            nodeVersion: environment.nodeVersion,
            hasDocker: environment.hasDocker,
          },
          scanners: environment.scanners.map((s) => ({
            name: s.name,
            source: s.source,
            available: s.available,
            version: s.version,
            path: s.path,
          })),
          missingScanners: preflight.missingScanners.map((s) => s.name),
          warnings: preflight.warnings,
          installInstructions: preflight.installInstructions,
          wsl: wslInfo,
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
              text: `Preflight check failed: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
