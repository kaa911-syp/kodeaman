import type { NormalizedFinding } from "@kodeaman/schema";

function occurrenceFor(finding: NormalizedFinding) {
  return {
    filePath: finding.location.filePath ?? finding.location.url ?? "unknown",
    target: finding.location.component,
    repoRoot: finding.repoContext?.repoFullName,
  };
}

function mergeOccurrences(
  primary: NormalizedFinding,
  duplicate: NormalizedFinding,
): NormalizedFinding {
  const seen = new Set<string>();
  const occurrences = [
    ...(primary.occurrences ?? [occurrenceFor(primary)]),
    ...(duplicate.occurrences ?? [occurrenceFor(duplicate)]),
  ].filter((occurrence) => {
    const key = `${occurrence.filePath}\0${occurrence.target ?? ""}\0${occurrence.repoRoot ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    ...primary,
    occurrences,
  };
}

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

    if (
      finding.prioritization.priorityScore >
      existing.prioritization.priorityScore
    ) {
      seen.set(finding.dedupeKey, mergeOccurrences(finding, existing));
    } else {
      seen.set(finding.dedupeKey, mergeOccurrences(existing, finding));
    }
  }

  return Array.from(seen.values());
}
