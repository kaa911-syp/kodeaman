/**
 * aspidasec_suggest_fix — Get fix suggestions for a security finding.
 *
 * Returns actionable fix commands and remediation steps for a finding.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { NormalizedFinding } from "@aspidasec/schema";

export function registerSuggestFixTool(server: McpServer): void {
  server.tool(
    "aspidasec_suggest_fix",
    "Get actionable fix suggestions for a security finding. Returns fix commands (npm/pnpm/yarn), remediation steps, safe code examples, and autofix eligibility. Provide the finding JSON from a scan result.",
    {
      finding: z
        .string()
        .describe(
          "The finding JSON object (stringified NormalizedFinding from a scan result)",
        ),
      language: z
        .enum(["en", "id"])
        .optional()
        .describe("Preferred language for descriptions. Defaults to 'en'."),
      packageManager: z
        .enum(["npm", "pnpm", "yarn"])
        .optional()
        .describe(
          "Package manager to use in fix commands. Defaults to 'npm'.",
        ),
    },
    async ({ finding, language, packageManager }) => {
      try {
        const parsed: NormalizedFinding = JSON.parse(finding);
        const locale = language ?? "en";
        const pm = packageManager ?? "npm";

        const coaching = parsed.coaching;

        // Filter fix commands by package manager if available
        const fixCommands = (parsed.fixCommands ?? []).filter(
          (cmd) => cmd.packageManager === pm,
        );

        // If no commands for the chosen PM, fall back to all available
        const availableCommands =
          fixCommands.length > 0 ? fixCommands : (parsed.fixCommands ?? []);

        const response = {
          findingId: parsed.findingId,
          title: parsed.title,
          severity: parsed.severity,
          category: parsed.category,

          fixCommands: availableCommands.map((cmd) => ({
            command: cmd.command,
            cwd: cmd.cwd,
            description: locale === "id" ? cmd.descriptionId : cmd.description,
            descriptionEn: cmd.description,
            descriptionId: cmd.descriptionId,
            isBreaking: cmd.isBreaking,
            packageManager: cmd.packageManager,
          })),

          remediation:
            locale === "id"
              ? coaching.remediationId
              : coaching.remediationEn,
          remediationEn: coaching.remediationEn,
          remediationId: coaching.remediationId,

          safeExample: coaching.safeExampleCode
            ? {
                title: coaching.safeExampleTitle,
                code: coaching.safeExampleCode,
              }
            : null,

          autofix: {
            eligible: coaching.autofixEligible ?? false,
            strategy: coaching.autofixStrategy ?? "none",
          },

          location: {
            filePath: parsed.location.filePath,
            startLine: parsed.location.startLine,
            endLine: parsed.location.endLine,
            snippet: parsed.location.snippet,
            url: parsed.location.url,
            component: parsed.location.component,
          },

          hasFixCommands: availableCommands.length > 0,
          hasRemediation: coaching.remediationEn.length > 0,
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
              text: `Failed to suggest fix: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
