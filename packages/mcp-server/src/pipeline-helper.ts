/**
 * Shared helpers for building the scan pipeline from config.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { ScanPipeline } from "@aspidasec/core";
import { loadConfig } from "@aspidasec/config";
import type { AspidasecConfig } from "@aspidasec/config";

export type { AspidasecConfig };

/**
 * Load AspidaSec configuration from a project directory.
 * Falls back to sensible defaults when no .aspidasec.yml exists,
 * including auto-detecting npm projects to enable npm-audit.
 */
export function loadProjectConfig(repoRoot: string): AspidasecConfig {
  const config = loadConfig(repoRoot);

  // Auto-detect: if the project has a package.json or package-lock.json,
  // enable npmAudit even if not explicitly configured.
  // This ensures "config-less" scanning works out of the box.
  const hasPackageJson = existsSync(join(repoRoot, "package.json"));
  const hasPackageLock = existsSync(join(repoRoot, "package-lock.json"));
  const hasPnpmLock = existsSync(join(repoRoot, "pnpm-lock.yaml"));

  if ((hasPackageJson || hasPackageLock || hasPnpmLock) && config.scanners.npmAudit === undefined) {
    config.scanners.npmAudit = true;
  }

  return config;
}

/**
 * Build a ScanPipeline with adapters registered based on config.
 */
export async function buildPipeline(
  config: AspidasecConfig,
): Promise<ScanPipeline> {
  const pipeline = new ScanPipeline(config as never);

  if (config.scanners.semgrep) {
    try {
      const { SemgrepAdapter } = await import("@aspidasec/adapters-semgrep");
      pipeline.registerAdapter(new SemgrepAdapter() as never);
    } catch {
      // Semgrep adapter not available
    }
  }

  if (config.scanners.zapBaseline) {
    try {
      const { ZapBaselineAdapter } = await import("@aspidasec/adapters-zap");
      pipeline.registerAdapter(new ZapBaselineAdapter() as never);
    } catch {
      // ZAP adapter not available
    }
  }

  if (config.scanners.npmAudit) {
    try {
      const { NpmAuditAdapter } = await import(
        "@aspidasec/adapters-npm-audit"
      );
      pipeline.registerAdapter(new NpmAuditAdapter() as never);
    } catch {
      // npm-audit adapter not available
    }
  }

  if (config.scanners.playwright) {
    try {
      const { PlaywrightAdapter } = await import(
        "@aspidasec/adapters-playwright"
      );
      pipeline.registerAdapter(new PlaywrightAdapter() as never);
    } catch {
      // Playwright adapter not available
    }
  }

  return pipeline;
}
