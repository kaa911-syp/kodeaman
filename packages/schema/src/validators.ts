import { z } from "zod";

export const FindingSourceSchema = z.enum([
  "semgrep",
  "zap-baseline",
  "zap-full",
  "codeql",
  "npm-audit",
  "custom",
]);

export const OwaspCategorySchema = z.enum([
  "A01-broken-access-control",
  "A02-cryptographic-failures",
  "A03-injection",
  "A04-insecure-design",
  "A05-security-misconfiguration",
  "A06-vulnerable-components",
  "A07-auth-failures",
  "A08-data-integrity-failures",
  "A09-logging-monitoring-failures",
  "A10-ssrf",
]);

export const FindingCategorySchema = z.enum([
  "sast",
  "dast",
  "sca",
  "secrets",
  "config",
  "auth",
  "input-validation",
  "xss",
  "sqli",
  "csrf",
  "file-upload",
  "ssrf",
  "rce",
  "info-leak",
  "misconfiguration",
  "other",
]);

export const SeverityLevelSchema = z.enum([
  "info",
  "low",
  "medium",
  "high",
  "critical",
]);

export const ConfidenceLevelSchema = z.enum(["low", "medium", "high"]);

export const RuntimeSurfaceSchema = z.enum([
  "source-code",
  "api",
  "web-page",
  "config",
  "dependency",
  "secret",
  "infrastructure",
  "unknown",
]);

export const FindingLocationSchema = z.object({
  filePath: z.string().optional(),
  startLine: z.number().int().optional(),
  endLine: z.number().int().optional(),
  startColumn: z.number().int().optional(),
  endColumn: z.number().int().optional(),
  snippet: z.string().optional(),
  url: z.string().optional(),
  httpMethod: z.string().optional(),
  parameter: z.string().optional(),
  component: z.string().optional(),
  routeName: z.string().optional(),
});

export const EvidenceBlockSchema = z.object({
  type: z.enum([
    "code",
    "http-request",
    "http-response",
    "trace",
    "scanner-message",
    "html-report",
    "terminal-snapshot",
    "other",
  ]),
  label: z.string(),
  content: z.string(),
  redacted: z.boolean().optional(),
});

export const ClassificationRefsSchema = z.object({
  cwe: z.array(z.string()).optional(),
  owasp: z.array(z.string()).optional(),
  capec: z.array(z.string()).optional(),
  cvssVector: z.string().optional(),
  cve: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  owaspCategories: z.array(OwaspCategorySchema).optional(),
});

export const RepoContextSchema = z.object({
  provider: z.enum(["github", "gitlab", "local"]).optional(),
  repoFullName: z.string().optional(),
  defaultBranch: z.string().optional(),
  branch: z.string().optional(),
  commitSha: z.string().optional(),
  pullRequestNumber: z.number().int().optional(),
  mergeRequestIid: z.number().int().optional(),
  environment: z
    .enum(["local", "preview", "staging", "production", "unknown"])
    .optional(),
  stackHints: z.array(z.string()).optional(),
  framework: z.array(z.string()).optional(),
  isPublicRepo: z.boolean().optional(),
});

export const PrioritizationFactorsSchema = z.object({
  baseSeverity: SeverityLevelSchema,
  adjustedSeverity: SeverityLevelSchema,
  priorityScore: z.number(),
  confidenceScore: z.number(),
  exploitabilityScore: z.number().optional(),
  businessImpactScore: z.number().optional(),
  reachabilityScore: z.number().optional(),
  internetExposureScore: z.number().optional(),
  authSurfaceScore: z.number().optional(),
  dataSensitivityScore: z.number().optional(),
  repeatedPatternScore: z.number().optional(),
  developerBurdenScore: z.number().optional(),
  reasons: z.array(z.string()),
});

export const CoachingContentSchema = z.object({
  titleEn: z.string(),
  titleId: z.string(),
  summaryEn: z.string(),
  summaryId: z.string(),
  whyItMattersEn: z.string(),
  whyItMattersId: z.string(),
  remediationEn: z.array(z.string()),
  remediationId: z.array(z.string()),
  safeExampleTitle: z.string().optional(),
  safeExampleCode: z.string().optional(),
  lessonId: z.string().optional(),
  lessonSlug: z.string().optional(),
  lessonLevel: z
    .enum(["beginner", "intermediate", "advanced"])
    .optional(),
  lessonEstimatedMinutes: z.number().int().optional(),
  autofixEligible: z.boolean().optional(),
  autofixStrategy: z
    .enum(["template-rewrite", "llm-draft", "none"])
    .optional(),
});

export const GamificationMetaSchema = z.object({
  issueFamily: z.string(),
  xpReward: z.number().optional(),
  badgeKey: z.string().optional(),
  streakEligible: z.boolean().optional(),
  questKey: z.string().optional(),
  questProgressDelta: z.number().optional(),
  repeatOffender: z.boolean().optional(),
});

export const RawToolRefsSchema = z.object({
  tool: FindingSourceSchema,
  toolRuleId: z.string().optional(),
  toolFindingId: z.string().optional(),
  toolUrl: z.string().optional(),
  rawSeverity: z.string().optional(),
  rawConfidence: z.string().optional(),
  rawCategory: z.string().optional(),
});

export const NormalizedFindingSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  findingId: z.string(),
  dedupeKey: z.string(),
  source: FindingSourceSchema,
  category: FindingCategorySchema,
  surface: RuntimeSurfaceSchema,
  owaspCategory: OwaspCategorySchema.optional(),

  severity: SeverityLevelSchema,
  confidence: ConfidenceLevelSchema,
  status: z.enum(["open", "fixed", "ignored", "accepted-risk"]),

  title: z.string(),
  description: z.string(),
  shortDescription: z.string().optional(),

  location: FindingLocationSchema,
  evidence: z.array(EvidenceBlockSchema),
  classification: ClassificationRefsSchema,
  raw: RawToolRefsSchema,

  repoContext: RepoContextSchema.optional(),
  prioritization: PrioritizationFactorsSchema,
  coaching: CoachingContentSchema,
  gamification: GamificationMetaSchema,

  detectedAt: z.string(),
  updatedAt: z.string().optional(),
});

export function parseNormalizedFinding(data: unknown) {
  return NormalizedFindingSchema.parse(data);
}

export function safeParseNormalizedFinding(data: unknown) {
  return NormalizedFindingSchema.safeParse(data);
}

export const OwaspScanPhaseResultSchema = z.object({
  owaspId: OwaspCategorySchema,
  owaspCode: z.string(),
  titleEn: z.string(),
  titleId: z.string(),
  findings: z.array(NormalizedFindingSchema),
  scanDurationMs: z.number(),
  scannersUsed: z.array(FindingSourceSchema),
  confidenceGate: z.enum(["passed", "filtered"]),
  filteredCount: z.number().int(),
});

export const OwaspScanReportSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  phases: z.array(OwaspScanPhaseResultSchema),
  totalFindings: z.number().int(),
  totalFiltered: z.number().int(),
  scanDurationMs: z.number(),
  environment: z.object({
    platform: z.enum(["linux", "wsl", "windows", "macos"]),
    wslDetected: z.boolean(),
    wslDistro: z.string().optional(),
    nodeVersion: z.string(),
    scannersAvailable: z.array(FindingSourceSchema),
  }),
  generatedAt: z.string(),
});
