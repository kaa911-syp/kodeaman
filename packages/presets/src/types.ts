export interface PresetConfig {
  name: string;
  description: string;
  framework: string;
  frameworkHints: string[];
  semgrepRules: string[];
  zapPolicies: string[];
  priorityOverrides: Record<string, number>;
  coachingOverrides: Record<string, string>;
}
