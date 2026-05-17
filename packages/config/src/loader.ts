import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { DEFAULT_CONFIG } from "./defaults.js";
import type { AspidasecConfig } from "./types.js";

const CONFIG_FILENAME = ".aspidasec.yml";

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    const val = override[key];
    const baseVal = result[key];
    if (
      val !== undefined &&
      typeof val === "object" &&
      val !== null &&
      !Array.isArray(val) &&
      typeof baseVal === "object" &&
      baseVal !== null &&
      !Array.isArray(baseVal)
    ) {
      result[key] = deepMerge(
        baseVal as Record<string, unknown>,
        val as Record<string, unknown>,
      );
    } else if (val !== undefined) {
      result[key] = val;
    }
  }
  return result;
}

function validateConfig(config: AspidasecConfig): void {
  const validLanguages = ["en", "id"];
  if (!validLanguages.includes(config.language)) {
    throw new Error(
      `Invalid language "${config.language}". Must be one of: ${validLanguages.join(", ")}`,
    );
  }

  const validSeverities = ["info", "low", "medium", "high", "critical"];
  if (!validSeverities.includes(config.prioritization.failOnSeverity)) {
    throw new Error(
      `Invalid failOnSeverity "${config.prioritization.failOnSeverity}". Must be one of: ${validSeverities.join(", ")}`,
    );
  }

  if (config.prioritization.maxFindingsInComment < 1) {
    throw new Error("maxFindingsInComment must be at least 1");
  }

  if (config.owasp) {
    const validConfidence = ["low", "medium", "high"];
    if (!validConfidence.includes(config.owasp.confidenceGate)) {
      throw new Error(
        `Invalid owasp.confidenceGate "${config.owasp.confidenceGate}". Must be one of: ${validConfidence.join(", ")}`,
      );
    }
    if (!validSeverities.includes(config.owasp.failOnSeverity)) {
      throw new Error(
        `Invalid owasp.failOnSeverity "${config.owasp.failOnSeverity}". Must be one of: ${validSeverities.join(", ")}`,
      );
    }
  }
}

export function loadConfig(repoRoot: string): AspidasecConfig {
  const configPath = resolve(repoRoot, CONFIG_FILENAME);

  if (!existsSync(configPath)) {
    return { ...DEFAULT_CONFIG };
  }

  const raw = readFileSync(configPath, "utf-8");
  const parsed = parseYaml(raw) as Partial<AspidasecConfig> | null;

  if (!parsed || typeof parsed !== "object") {
    return { ...DEFAULT_CONFIG };
  }

  const merged = deepMerge(
    DEFAULT_CONFIG as unknown as Record<string, unknown>,
    parsed as Record<string, unknown>,
  ) as unknown as AspidasecConfig;
  validateConfig(merged);

  return merged;
}

export function loadConfigFromString(content: string): AspidasecConfig {
  const parsed = parseYaml(content) as Partial<AspidasecConfig> | null;

  if (!parsed || typeof parsed !== "object") {
    return { ...DEFAULT_CONFIG };
  }

  const merged = deepMerge(
    DEFAULT_CONFIG as unknown as Record<string, unknown>,
    parsed as Record<string, unknown>,
  ) as unknown as AspidasecConfig;
  validateConfig(merged);

  return merged;
}
