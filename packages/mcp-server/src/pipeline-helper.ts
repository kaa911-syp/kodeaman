/**
 * Shared helpers for building the scan pipeline from config.
 */

import { ScanPipeline } from "@kodeaman/core";
import { loadConfig } from "@kodeaman/config";
import type { KodeamanConfig } from "@kodeaman/config";

export type { KodeamanConfig };

/**
 * Load KodeAman configuration from a project directory.
 */
export function loadProjectConfig(repoRoot: string): KodeamanConfig {
  return loadConfig(repoRoot);
}

/**
 * Build a ScanPipeline with adapters registered based on config.
 */
export async function buildPipeline(
  config: KodeamanConfig,
): Promise<ScanPipeline> {
  const pipeline = new ScanPipeline(config as never);

  if (config.scanners.semgrep) {
    try {
      const { SemgrepAdapter } = await import("@kodeaman/adapters-semgrep");
      pipeline.registerAdapter(new SemgrepAdapter() as never);
    } catch {
      // Semgrep adapter not available
    }
  }

  if (config.scanners.zapBaseline) {
    try {
      const { ZapBaselineAdapter } = await import("@kodeaman/adapters-zap");
      pipeline.registerAdapter(new ZapBaselineAdapter() as never);
    } catch {
      // ZAP adapter not available
    }
  }

  if (config.scanners.npmAudit) {
    try {
      const { NpmAuditAdapter } = await import(
        "@kodeaman/adapters-npm-audit"
      );
      pipeline.registerAdapter(new NpmAuditAdapter() as never);
    } catch {
      // npm-audit adapter not available
    }
  }

  if (config.scanners.playwright) {
    try {
      const { PlaywrightAdapter } = await import(
        "@kodeaman/adapters-playwright"
      );
      pipeline.registerAdapter(new PlaywrightAdapter() as never);
    } catch {
      // Playwright adapter not available
    }
  }

  return pipeline;
}
