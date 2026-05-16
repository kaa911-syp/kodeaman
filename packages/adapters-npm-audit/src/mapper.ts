import type { SeverityLevel, ConfidenceLevel } from "@kodeaman/schema";
import type { NpmVulnerability, NpmVulnerabilityVia } from "./types.js";
import { createHash } from "node:crypto";

export function mapSeverity(npmSeverity: string): SeverityLevel {
  switch (npmSeverity.toLowerCase()) {
    case "critical":
      return "critical";
    case "high":
      return "high";
    case "moderate":
      return "medium";
    case "low":
      return "low";
    case "info":
      return "info";
    default:
      return "info";
  }
}

export function mapConfidence(vuln: NpmVulnerability): ConfidenceLevel {
  const viaDetails = getViaDetails(vuln);
  if (viaDetails.length > 0 && viaDetails[0].cvss.score >= 7) {
    return "high";
  }
  if (viaDetails.length > 0 && viaDetails[0].cvss.score >= 4) {
    return "medium";
  }
  return "low";
}

export function extractCweIds(vuln: NpmVulnerability): string[] {
  const cwes: string[] = [];
  for (const via of vuln.via) {
    if (typeof via === "object" && via.cwe) {
      cwes.push(...via.cwe);
    }
  }
  return [...new Set(cwes)];
}

export function extractCveIds(vuln: NpmVulnerability): string[] {
  const cves: string[] = [];
  for (const via of vuln.via) {
    if (typeof via === "object" && via.url) {
      const match = via.url.match(/CVE-\d{4}-\d+/i);
      if (match) {
        cves.push(match[0]);
      }
    }
  }
  return [...new Set(cves)];
}

export function getViaDetails(vuln: NpmVulnerability): NpmVulnerabilityVia[] {
  return vuln.via.filter(
    (v): v is NpmVulnerabilityVia => typeof v === "object",
  );
}

export function getAdvisoryUrl(vuln: NpmVulnerability): string | undefined {
  const viaDetails = getViaDetails(vuln);
  return viaDetails[0]?.url;
}

export function getAdvisoryTitle(vuln: NpmVulnerability): string {
  const viaDetails = getViaDetails(vuln);
  if (viaDetails.length > 0) {
    return viaDetails[0].title;
  }
  return `Vulnerability in ${vuln.name}`;
}

export function generateDedupeKey(packageName: string, vuln: NpmVulnerability): string {
  const viaDetails = getViaDetails(vuln);
  const sourceId = viaDetails[0]?.source ?? packageName;
  const parts = [packageName, String(sourceId), vuln.range];
  return createHash("sha256").update(parts.join(":")).digest("hex").slice(0, 16);
}

export function generateFindingId(packageName: string, vuln: NpmVulnerability): string {
  const viaDetails = getViaDetails(vuln);
  const sourceId = viaDetails[0]?.source ?? packageName;
  const parts = ["npm-audit", packageName, String(sourceId), vuln.severity, vuln.range];
  return createHash("sha256").update(parts.join(":")).digest("hex").slice(0, 24);
}
