export interface NpmVulnerability {
  name: string;
  severity: "info" | "low" | "moderate" | "high" | "critical";
  isDirect: boolean;
  via: Array<NpmVulnerabilityVia | string>;
  effects: string[];
  range: string;
  nodes: string[];
  fixAvailable: boolean | NpmFixAvailable;
}

export interface NpmVulnerabilityVia {
  source: number;
  name: string;
  dependency: string;
  title: string;
  url: string;
  severity: string;
  cwe: string[];
  cvss: {
    score: number;
    vectorString?: string;
  };
  range: string;
}

export interface NpmFixAvailable {
  name: string;
  version: string;
  isSemVerMajor: boolean;
}

export interface NpmAuditMetadata {
  vulnerabilities: {
    info: number;
    low: number;
    moderate: number;
    high: number;
    critical: number;
    total: number;
  };
  dependencies: {
    prod: number;
    dev: number;
    optional: number;
    peer: number;
    peerOptional: number;
    total: number;
  };
}

export interface NpmAuditResult {
  auditReportVersion: number;
  vulnerabilities: Record<string, NpmVulnerability>;
  metadata: NpmAuditMetadata;
}

export interface NpmAuditScanContext {
  targetPath: string;
  packageManager?: "npm" | "pnpm";
  extraArgs?: string[];
  timeout?: number;
}
