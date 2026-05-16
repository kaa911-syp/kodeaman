export interface ReportConfig {
  locale: "en" | "id";
  theme: "light" | "dark" | "auto";
  gamificationEnabled: boolean;
  includeEvidence: boolean;
  maxFindingsPerCategory: number;
  screenshotRequiredForWebFindings: boolean;
  generatedFindingsAllowed: boolean;
}

export const DEFAULT_REPORT_CONFIG: ReportConfig = {
  locale: "id",
  theme: "auto",
  gamificationEnabled: true,
  includeEvidence: true,
  maxFindingsPerCategory: 20,
  screenshotRequiredForWebFindings: true,
  generatedFindingsAllowed: false,
};
