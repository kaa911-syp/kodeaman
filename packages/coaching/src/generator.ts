import type { NormalizedFinding, CoachingContent } from "@aspidasec/schema";
import { LessonRegistry } from "@aspidasec/lessons";
import {
  getTemplateByRuleId,
  getTemplatesByCategory,
  type CoachingTemplate,
} from "./templates.js";

export class CoachingGenerator {
  private lessonRegistry: LessonRegistry;

  constructor() {
    this.lessonRegistry = new LessonRegistry();
  }

  generate(
    finding: NormalizedFinding,
    _locale: "en" | "id" = "en",
  ): CoachingContent {
    const template = this.resolveTemplate(finding);

    if (!template) {
      return this.buildFallback(finding);
    }

    const content: CoachingContent = {
      titleEn: template.titleEn,
      titleId: template.titleId,
      summaryEn: template.summaryEn,
      summaryId: template.summaryId,
      whyItMattersEn: template.whyItMattersEn,
      whyItMattersId: template.whyItMattersId,
      remediationEn: template.remediationEn,
      remediationId: template.remediationId,
      safeExampleTitle: template.safeExampleTitle,
      safeExampleCode: template.safeExampleCode,
      autofixEligible: template.autofixEligible,
      autofixStrategy: template.autofixStrategy,
    };

    if (template.lessonId) {
      const lesson = this.lessonRegistry.getLesson(template.lessonId);
      if (lesson) {
        content.lessonId = lesson.id;
        content.lessonSlug = lesson.slug;
        content.lessonLevel = lesson.level;
        content.lessonEstimatedMinutes = lesson.estimatedMinutes;
      }
    }

    return content;
  }

  private resolveTemplate(
    finding: NormalizedFinding,
  ): CoachingTemplate | undefined {
    if (finding.raw.toolRuleId) {
      const byRule = getTemplateByRuleId(finding.raw.toolRuleId);
      if (byRule) return byRule;
    }

    const byCategory = getTemplatesByCategory(finding.category);
    if (byCategory.length > 0) {
      return byCategory[0];
    }

    return undefined;
  }

  private buildFallback(finding: NormalizedFinding): CoachingContent {
    return {
      titleEn: `Security Issue: ${finding.title}`,
      titleId: `Masalah Keamanan: ${finding.title}`,
      summaryEn: finding.description,
      summaryId: finding.description,
      whyItMattersEn:
        "This issue may compromise the security of your application. Review the finding details and apply the recommended fix.",
      whyItMattersId:
        "Masalah ini bisa membahayakan keamanan aplikasi kamu. Tinjau detail temuan dan terapkan perbaikan yang disarankan.",
      remediationEn: ["Review the finding details and apply the appropriate fix"],
      remediationId: ["Tinjau detail temuan dan terapkan perbaikan yang sesuai"],
      autofixEligible: false,
      autofixStrategy: "none",
    };
  }
}
