#!/usr/bin/env node
/**
 * AspidaSec MCP Server
 *
 * Model Context Protocol server that exposes AspidaSec security scanning
 * capabilities as tools for AI coding assistants (Vibe Coding).
 *
 * Tools provided:
 *   - aspidasec_scan            Run a security scan on a project directory
 *   - aspidasec_owasp_scan      Run OWASP Top 10 security scan with evidence
 *   - aspidasec_preflight       Check environment readiness (scanners, WSL, etc.)
 *   - aspidasec_list_scanners   List available security scanners
 *   - aspidasec_explain_finding Explain a finding with coaching content
 *   - aspidasec_suggest_fix     Get fix suggestions for a finding
 *   - aspidasec_convert_sarif   Convert findings to SARIF format
 *   - aspidasec_coverage_report Generate OWASP coverage report
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerScanTool } from "./tools/scan.js";
import { registerOwaspScanTool } from "./tools/owasp-scan.js";
import { registerPreflightTool } from "./tools/preflight.js";
import { registerListScannersTool } from "./tools/list-scanners.js";
import { registerExplainFindingTool } from "./tools/explain-finding.js";
import { registerSuggestFixTool } from "./tools/suggest-fix.js";
import { registerConvertSarifTool } from "./tools/convert-sarif.js";
import { registerCoverageReportTool } from "./tools/coverage-report.js";

const SERVER_NAME = "aspidasec";
const SERVER_VERSION = "0.1.0";

async function main(): Promise<void> {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // Register all tools
  registerScanTool(server);
  registerOwaspScanTool(server);
  registerPreflightTool(server);
  registerListScannersTool(server);
  registerExplainFindingTool(server);
  registerSuggestFixTool(server);
  registerConvertSarifTool(server);
  registerCoverageReportTool(server);

  // Connect via stdio transport (standard for MCP)
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("AspidaSec MCP server failed to start:", err);
  process.exit(1);
});
