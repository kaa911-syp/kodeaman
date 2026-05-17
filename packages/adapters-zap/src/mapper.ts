import type {
  SeverityLevel,
  ConfidenceLevel,
  FindingCategory,
} from "@aspidasec/schema";
import type { ZapAlert, ZapAlertInstance } from "./types.js";
import { createHash } from "node:crypto";

export function mapRiskCode(code: string): SeverityLevel {
  switch (code) {
    case "3":
      return "high";
    case "2":
      return "medium";
    case "1":
      return "low";
    case "0":
      return "info";
    default:
      return "info";
  }
}

export function mapZapConfidence(confidence: string): ConfidenceLevel {
  switch (confidence) {
    case "3":
      return "high";
    case "2":
      return "medium";
    case "1":
    case "0":
      return "low";
    default:
      return "medium";
  }
}

export function mapZapCategory(alert: ZapAlert): FindingCategory {
  const cweid = alert.cweid;
  const name = alert.name.toLowerCase();

  if (cweid === "89") return "sqli";
  if (cweid === "79" || name.includes("xss") || name.includes("cross-site scripting")) return "xss";
  if (cweid === "352" || name.includes("csrf")) return "csrf";
  if (cweid === "918" || name.includes("ssrf")) return "ssrf";
  if (name.includes("injection") || cweid === "78" || cweid === "77") return "rce";
  if (name.includes("auth") || cweid === "287" || cweid === "306") return "auth";
  if (name.includes("information") || name.includes("disclosure") || name.includes("leak")) return "info-leak";
  if (name.includes("header") || name.includes("config") || name.includes("misconfiguration")) return "misconfiguration";
  if (name.includes("upload") || cweid === "434") return "file-upload";

  return "dast";
}

export function mapWascToOwasp(wascid: string): string[] {
  const mapping: Record<string, string[]> = {
    "1": ["A03:2021 - Injection"],
    "8": ["A07:2021 - Cross-Site Scripting (XSS)"],
    "9": ["A09:2021 - Security Logging and Monitoring Failures"],
    "13": ["A02:2021 - Cryptographic Failures"],
    "14": ["A05:2021 - Security Misconfiguration"],
    "15": ["A05:2021 - Security Misconfiguration"],
  };
  return mapping[wascid] ?? [];
}

export function generateDedupeKey(alert: ZapAlert, instance: ZapAlertInstance): string {
  const parts = [alert.pluginid, instance.uri, instance.param || ""];
  return createHash("sha256").update(parts.join(":")).digest("hex").slice(0, 16);
}

export function generateFindingId(alert: ZapAlert, instance: ZapAlertInstance): string {
  const parts = [
    "zap",
    alert.pluginid,
    instance.uri,
    instance.method,
    instance.param || "",
  ];
  return createHash("sha256").update(parts.join(":")).digest("hex").slice(0, 24);
}
