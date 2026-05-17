import type {
  NormalizedFinding,
  GamificationMeta,
  SeverityLevel,
  FindingCategory,
} from "@aspidasec/schema";
import { badges } from "./badges.js";
import { quests, type Quest } from "./quests.js";

export interface FindingHistory {
  totalFixed: number;
  fixedByCategory: Record<string, number>;
  consecutiveCleanPrs: number;
  totalXp: number;
}

const XP_BY_SEVERITY: Record<SeverityLevel, number> = {
  critical: 25,
  high: 15,
  medium: 10,
  low: 5,
  info: 1,
};

const CATEGORY_BADGE_MAP: Record<string, string> = {
  sqli: "first-sqli-fix",
  xss: "first-xss-fix",
};

export class GamificationEngine {
  applyGamification(
    finding: NormalizedFinding,
    history?: FindingHistory,
  ): GamificationMeta {
    const xpReward = this.calculateXpReward(finding.severity, finding.category);
    const badgeKey = this.checkBadgeEligibility(finding, history);
    const questResult = this.findMatchingQuest(finding, history);
    const repeatOffender = this.isRepeatOffender(finding, history);

    return {
      issueFamily: finding.category,
      xpReward,
      badgeKey,
      streakEligible: finding.severity === "info" || finding.status === "fixed",
      questKey: questResult?.questKey,
      questProgressDelta: questResult?.progressDelta,
      repeatOffender,
    };
  }

  calculateXpReward(severity: SeverityLevel, _category: FindingCategory): number {
    return XP_BY_SEVERITY[severity] ?? 5;
  }

  checkBadgeEligibility(
    finding: NormalizedFinding,
    history?: FindingHistory,
  ): string | undefined {
    if (!history) {
      return badges.length > 0 ? "first-fix" : undefined;
    }

    if (history.totalFixed === 0) {
      return "first-fix";
    }

    const categoryBadge = CATEGORY_BADGE_MAP[finding.category];
    if (
      categoryBadge &&
      (!history.fixedByCategory[finding.category] ||
        history.fixedByCategory[finding.category] === 0)
    ) {
      return categoryBadge;
    }

    if (history.consecutiveCleanPrs >= 3 && history.consecutiveCleanPrs < 7) {
      return "streak-3";
    }
    if (history.consecutiveCleanPrs >= 7) {
      return "streak-7";
    }

    const totalXpAfter =
      history.totalXp + this.calculateXpReward(finding.severity, finding.category);
    if (history.totalXp < 100 && totalXpAfter >= 100) {
      return "security-champion";
    }

    return undefined;
  }

  checkQuestProgress(
    finding: NormalizedFinding,
    quest: Quest,
  ): { questKey: string; progressDelta: number } {
    if (quest.category && finding.category !== quest.category) {
      return { questKey: quest.key, progressDelta: 0 };
    }
    return { questKey: quest.key, progressDelta: 1 };
  }

  isRepeatOffender(
    finding: NormalizedFinding,
    history?: FindingHistory,
  ): boolean {
    if (!history?.fixedByCategory) return false;
    const count = history.fixedByCategory[finding.category] ?? 0;
    return count >= 3;
  }

  private findMatchingQuest(
    finding: NormalizedFinding,
    _history?: FindingHistory,
  ): { questKey: string; progressDelta: number } | undefined {
    for (const quest of quests) {
      if (!quest.category || quest.category === finding.category) {
        const result = this.checkQuestProgress(finding, quest);
        if (result.progressDelta > 0) return result;
      }
    }
    return undefined;
  }
}
