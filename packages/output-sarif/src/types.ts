export type SarifLevel = "error" | "warning" | "note" | "none";

export interface SarifLog {
  version: "2.1.0";
  $schema: "https://json.schemastore.org/sarif-2.1.0.json";
  runs: SarifRun[];
}

export interface SarifRun {
  tool: SarifTool;
  results: SarifResult[];
}

export interface SarifTool {
  driver: {
    name: string;
    version: string;
    informationUri?: string;
    rules: SarifRule[];
  };
}

export interface SarifRule {
  id: string;
  name?: string;
  shortDescription?: {
    text: string;
  };
  fullDescription?: {
    text: string;
  };
  help?: {
    text: string;
  };
  properties?: {
    tags?: string[];
    [key: string]: unknown;
  };
}

export interface SarifResult {
  ruleId: string;
  level: SarifLevel;
  message: {
    text: string;
  };
  locations: SarifLocation[];
  partialFingerprints?: Record<string, string>;
  properties?: {
    findingId?: string;
    severity?: string;
    confidence?: string;
    category?: string;
    source?: string;
    [key: string]: unknown;
  };
}

export interface SarifLocation {
  physicalLocation?: {
    artifactLocation?: {
      uri: string;
    };
    region?: {
      startLine?: number;
      endLine?: number;
      startColumn?: number;
      endColumn?: number;
      snippet?: {
        text: string;
      };
    };
  };
  logicalLocations?: Array<{
    name?: string;
    fullyQualifiedName?: string;
    kind?: string;
  }>;
  properties?: {
    url?: string;
    httpMethod?: string;
    parameter?: string;
    component?: string;
    routeName?: string;
    [key: string]: unknown;
  };
}
