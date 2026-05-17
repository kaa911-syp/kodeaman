/**
 * aspidasec_explain_finding — Explain a security finding with coaching content.
 *
 * Given a finding ID or finding JSON, returns bilingual coaching content:
 * what the issue is, why it matters, and how to fix it.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { NormalizedFinding } from "@aspidasec/schema";

export function registerExplainFindingTool(server: McpServer): void {
  server.tool(
    "aspidasec_explain_finding",
    "Explain a security finding in detail. Provide the finding JSON and get back bilingual (English + Indonesian) coaching content including: what the vulnerability is, why it matters, step-by-step remediation, safe code examples, OWASP/CWE classification, and gamification rewards.",
    {
      finding: z
        .string()
        .describe(
          "The finding JSON object (stringified NormalizedFinding from a scan result)",
        ),
      language: z
        .enum(["en", "id"])
        .optional()
        .describe(
          "Preferred language for the explanation. Both languages are always included, but the preferred one is shown first. Defaults to 'en'.",
        ),
    },
    async ({ finding, language }) => {
      try {
        const parsed: NormalizedFinding = JSON.parse(finding);
        const locale = language ?? "en";

        const coaching = parsed.coaching;
        const classification = parsed.classification;
        const gamification = parsed.gamification;
        const prioritization = parsed.prioritization;

        // Build a rich explanation
        const explanation = {
          findingId: parsed.findingId,
          title: locale === "id" ? coaching.titleId : coaching.titleEn,
          titleEn: coaching.titleEn,
          titleId: coaching.titleId,

          summary: locale === "id" ? coaching.summaryId : coaching.summaryEn,
          summaryEn: coaching.summaryEn,
          summaryId: coaching.summaryId,

          whyItMatters:
            locale === "id"
              ? coaching.whyItMattersId
              : coaching.whyItMattersEn,
          whyItMattersEn: coaching.whyItMattersEn,
          whyItMattersId: coaching.whyItMattersId,

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

          lesson: coaching.lessonSlug
            ? {
                slug: coaching.lessonSlug,
                level: coaching.lessonLevel,
                estimatedMinutes: coaching.lessonEstimatedMinutes,
              }
            : null,

          classification: {
            severity: parsed.severity,
            confidence: parsed.confidence,
            category: parsed.category,
            surface: parsed.surface,
            owaspCategory: parsed.owaspCategory,
            cwe: classification.cwe,
            owasp: classification.owasp,
            cve: classification.cve,
            tags: classification.tags,
          },

          priority: {
            score: prioritization.priorityScore,
            baseSeverity: prioritization.baseSeverity,
            adjustedSeverity: prioritization.adjustedSeverity,
            reasons: prioritization.reasons,
          },

          gamification: {
            issueFamily: gamification.issueFamily,
            xpReward: gamification.xpReward,
            badgeKey: gamification.badgeKey,
            repeatOffender: gamification.repeatOffender,
          },

          autofix: coaching.autofixEligible
            ? {
                eligible: true,
                strategy: coaching.autofixStrategy,
              }
            : { eligible: false },

          fixCommands: parsed.fixCommands ?? [],
        };

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(explanation, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Failed to explain finding: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
