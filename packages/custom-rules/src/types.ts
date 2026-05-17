import type {
  FindingCategory,
  OwaspCategory,
  SeverityLevel,
} from "@aspidasec/schema";

export interface AspidasecRule {
  id: string;
  title: string;
  titleId: string;
  description: string;
  descriptionId: string;
  severity: SeverityLevel;
  category: FindingCategory;
  pattern: string;
  fileGlob: string;
  owaspCategory?: OwaspCategory;
  cwe?: string[];
  remediation: string[];
  remediationId: string[];
}

export interface CustomRulesConfig {
  directory?: string;
  rules?: AspidasecRule[];
}

export interface RuleValidationResult {
  valid: boolean;
  rule?: AspidasecRule;
  errors: string[];
  filePath?: string;
}
