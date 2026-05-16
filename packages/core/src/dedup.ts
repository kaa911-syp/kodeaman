import type { NormalizedFinding } from "@kodeaman/schema";

export function deduplicateFindings(
  findings: NormalizedFinding[]
): NormalizedFinding[] {
  const seen = new Map<string, NormalizedFinding>();

  for (const finding of findings) {
    const existing = seen.get(finding.dedupeKey);
    if (!existing) {
      seen.set(finding.dedupeKey, finding);
      continue;
    }

    // Keep the finding with higher priority score
    if (
      finding.prioritization.priorityScore >
      existing.prioritization.priorityScore
    ) {
      seen.set(finding.dedupeKey, finding);
    }
  }

  return Array.from(seen.values());
}
