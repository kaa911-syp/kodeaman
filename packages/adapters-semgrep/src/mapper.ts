import type {
  SeverityLevel,
  ConfidenceLevel,
  FindingCategory,
  RuntimeSurface,
} from "@aspidasec/schema";
import type { SemgrepResult } from "./types.js";
import { createHash } from "node:crypto";

export function mapSeverity(semgrepSeverity: string): SeverityLevel {
  switch (semgrepSeverity.toUpperCase()) {
    case "ERROR":
      return "high";
    case "WARNING":
      return "medium";
    case "INFO":
      return "low";
    default:
      return "info";
  }
}

export function mapConfidence(metadata: SemgrepResult["extra"]["metadata"]): ConfidenceLevel {
  const raw = metadata.confidence?.toLowerCase();
  if (raw === "high" || raw === "medium" || raw === "low") {
    return raw;
  }
  const likelihood = metadata.likelihood?.toLowerCase();
  if (likelihood === "high") return "high";
  if (likelihood === "medium") return "medium";
  if (likelihood === "low") return "low";
  return "medium";
}

function extractCweIds(cwes: string[]): Set<string> {
  const ids = new Set<string>();
  for (const cwe of cwes) {
    const match = cwe.match(/CWE-(\d+)/i);
    if (match) ids.add(match[1]);
  }
  return ids;
}

export function mapCategory(metadata: SemgrepResult["extra"]["metadata"]): FindingCategory {
  const cat = metadata.category?.toLowerCase() ?? "";
  const cweIds = extractCweIds(metadata.cwe ?? []);
  const ruleCategory = metadata.source?.toLowerCase() ?? "";

  if (cat === "security" || ruleCategory.includes("security")) {
    if (cweIds.has("798")) return "secrets";
    if (cweIds.has("89")) return "sqli";
    if (cweIds.has("79")) return "xss";
    if (cweIds.has("352")) return "csrf";
    if (cweIds.has("918")) return "ssrf";
    if (cweIds.has("78") || cweIds.has("77")) return "rce";
    if (cweIds.has("200") || cweIds.has("209")) return "info-leak";
    if (cweIds.has("287") || cweIds.has("306") || cweIds.has("862")) return "auth";
    if (cweIds.has("434")) return "file-upload";
    if (cweIds.has("20")) return "input-validation";
    return "sast";
  }

  if (cat.includes("secret") || cat.includes("credential")) return "secrets";
  if (cat.includes("config") || cat.includes("misconfiguration")) return "config";

  return "sast";
}

export function mapSurface(metadata: SemgrepResult["extra"]["metadata"]): RuntimeSurface {
  const tech = (metadata.technology ?? []).join(",").toLowerCase();
  if (tech.includes("secret") || tech.includes("credential")) return "secret";
  if (tech.includes("docker") || tech.includes("terraform") || tech.includes("kubernetes")) return "infrastructure";
  if (tech.includes("config") || tech.includes("yaml") || tech.includes("json")) return "config";
  return "source-code";
}

export function generateDedupeKey(result: SemgrepResult): string {
  const parts = [result.check_id, result.path, String(result.start.line)];
  return createHash("sha256").update(parts.join(":")).digest("hex").slice(0, 16);
}

export function generateFindingId(result: SemgrepResult): string {
  const parts = [
    "semgrep",
    result.check_id,
    result.path,
    String(result.start.line),
    String(result.start.col),
  ];
  return createHash("sha256").update(parts.join(":")).digest("hex").slice(0, 24);
}
