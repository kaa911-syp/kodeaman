import type { OwaspCategory, FindingCategory, FindingSource } from "@aspidasec/schema";

export interface OwaspCategoryDefinition {
  code: string;
  id: OwaspCategory;
  titleEn: string;
  titleId: string;
  descriptionEn: string;
  descriptionId: string;
  cweIds: number[];
  findingCategories: FindingCategory[];
  semgrepRules: string[];
  zapPolicies: string[];
}

export interface CweMapping {
  cweId: number;
  owaspCategories: OwaspCategory[];
}
