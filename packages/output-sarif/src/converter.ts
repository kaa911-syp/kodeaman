import type { NormalizedFinding, SeverityLevel } from "@kodeaman/schema";
import type { SarifLevel, SarifLocation, SarifLog, SarifResult, SarifRule } from "./types.js";

const TOOL_NAME = "kodeaman";
const TOOL_VERSION = "0.1.0";

function severityToLevel(severity: SeverityLevel): SarifLevel {
  switch (severity) {
    case "critical":
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
    case "info":
      return "note";
  }
}

function getRuleId(finding: NormalizedFinding): string {
  return finding.raw.toolRuleId ?? `${finding.raw.tool}.${finding.category}`;
}

function buildRegion(location: NormalizedFinding["location"]): NonNullable<NonNullable<SarifLocation["physicalLocation"]>["region"]> {
  return {
    startLine: location.startLine,
    endLine: location.endLine,
    startColumn: location.startColumn,
    endColumn: location.endColumn,
    snippet: location.snippet ? { text: location.snippet } : undefined,
  };
}

function buildLocation(finding: NormalizedFinding): SarifLocation {
  const location = finding.location;
  const sarifLocation: SarifLocation = {};

  if (location.filePath) {
    sarifLocation.physicalLocation = {
      artifactLocation: {
        uri: location.filePath,
      },
      region: buildRegion(location),
    };
  }

  if (location.component || location.routeName) {
    sarifLocation.logicalLocations = [
      {
        name: location.component ?? location.routeName,
        fullyQualifiedName: location.routeName ?? location.component,
        kind: location.routeName ? "function" : "module",
      },
    ];
  }

  const properties = {
    url: location.url,
    httpMethod: location.httpMethod,
    parameter: location.parameter,
    component: location.component,
    routeName: location.routeName,
  };

  if (Object.values(properties).some((value) => value !== undefined)) {
    sarifLocation.properties = properties;
  }

  return sarifLocation;
}

function buildRule(finding: NormalizedFinding): SarifRule {
  const tags = [
    ...finding.classification.cwe ?? [],
    ...finding.classification.tags ?? [],
  ];

  return {
    id: getRuleId(finding),
    name: finding.title,
    shortDescription: {
      text: finding.shortDescription ?? finding.title,
    },
    fullDescription: {
      text: finding.description,
    },
    help: {
      text: finding.coaching.remediationEn.join("\n"),
    },
    properties: tags.length > 0 ? { tags: [...new Set(tags)] } : undefined,
  };
}

function buildResult(finding: NormalizedFinding): SarifResult {
  return {
    ruleId: getRuleId(finding),
    level: severityToLevel(finding.severity),
    message: {
      text: finding.description,
    },
    locations: [buildLocation(finding)],
    partialFingerprints: {
      dedupeKey: finding.dedupeKey,
    },
    properties: {
      findingId: finding.findingId,
      severity: finding.severity,
      confidence: finding.confidence,
      category: finding.category,
      source: finding.source,
    },
  };
}

export class SarifConverter {
  convert(findings: NormalizedFinding[]): SarifLog {
    const rulesById = new Map<string, SarifRule>();
    const results = findings.map((finding) => {
      const ruleId = getRuleId(finding);
      if (!rulesById.has(ruleId)) {
        rulesById.set(ruleId, buildRule(finding));
      }

      return buildResult(finding);
    });

    return {
      version: "2.1.0",
      $schema: "https://json.schemastore.org/sarif-2.1.0.json",
      runs: [
        {
          tool: {
            driver: {
              name: TOOL_NAME,
              version: TOOL_VERSION,
              rules: [...rulesById.values()],
            },
          },
          results,
        },
      ],
    };
  }
}
