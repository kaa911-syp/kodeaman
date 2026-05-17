import type { OwaspCategory, NormalizedFinding } from "@aspidasec/schema";
import { CWE_TO_OWASP, OWASP_BY_ID, OWASP_BY_CODE, type OwaspCategoryId } from "./categories.js";
import type { OwaspCategoryDefinition } from "./types.js";

/**
 * Maps a CWE ID (numeric) to the OWASP Top 10 2021 categories it belongs to.
 * Returns an empty array if the CWE is not mapped to any OWASP category.
 */
export function mapCweToOwasp(cweId: number): OwaspCategory[] {
  return CWE_TO_OWASP.get(cweId) ?? [];
}

/**
 * Maps a NormalizedFinding to its OWASP Top 10 2021 categories based on:
 * 1. Existing owaspCategory field on the finding
 * 2. owaspCategories in the finding's classification
 * 3. CWE IDs in the finding's classification
 *
 * Returns deduplicated OWASP category IDs.
 */
export function mapFindingToOwasp(finding: NormalizedFinding): OwaspCategory[] {
  const categories = new Set<OwaspCategory>();

  // If the finding already has an owaspCategory, include it
  if (finding.owaspCategory) {
    categories.add(finding.owaspCategory);
  }

  // If the finding has owaspCategories in classification, include them
  if (finding.classification.owaspCategories) {
    for (const cat of finding.classification.owaspCategories) {
      categories.add(cat);
    }
  }

  // Map from CWE IDs
  if (finding.classification.cwe) {
    for (const cweStr of finding.classification.cwe) {
      // CWE strings may be in format "CWE-79" or just "79"
      const match = cweStr.match(/(\d+)/);
      if (match) {
        const cweId = Number.parseInt(match[1], 10);
        const mapped = mapCweToOwasp(cweId);
        for (const cat of mapped) {
          categories.add(cat);
        }
      }
    }
  }

  return [...categories];
}

/**
 * Gets the full OWASP category definition for a given category ID.
 * Returns undefined if the category ID is not recognized.
 */
export function getOwaspDefinition(
  id: OwaspCategory,
): OwaspCategoryDefinition | undefined {
  return OWASP_BY_ID.get(id);
}

/**
 * Check if a finding matches a specific OWASP category (by short code like "A01")
 * based on CWE overlap.
 */
export function findingMatchesCategory(
  finding: NormalizedFinding,
  categoryId: OwaspCategoryId,
): boolean {
  const category = OWASP_BY_CODE.get(categoryId);
  if (!category) return false;

  const cwes = finding.classification.cwe ?? [];
  const categorySet = new Set(category.cweIds);

  return cwes.some((cweStr) => {
    const match = cweStr.match(/(\d+)/);
    if (!match) return false;
    return categorySet.has(Number.parseInt(match[1], 10));
  });
}
