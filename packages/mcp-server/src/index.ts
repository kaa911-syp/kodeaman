#!/usr/bin/env node
/**
 * KodeAman MCP Server
 *
 * Model Context Protocol server that exposes KodeAman security scanning
 * capabilities as tools for AI coding assistants (Vibe Coding).
 *
 * Tools provided:
 *   - kodeaman_scan            Run a security scan on a project directory
 *   - kodeaman_owasp_scan      Run OWASP Top 10 security scan with evidence
 *   - kodeaman_preflight       Check environment readiness (scanners, WSL, etc.)
 *   - kodeaman_list_scanners   List available security scanners
 *   - kodeaman_explain_finding Explain a finding with coaching content
 *   - kodeaman_suggest_fix     Get fix suggestions for a finding
 *   - kodeaman_convert_sarif   Convert findings to SARIF format
 *   - kodeaman_coverage_report Generate OWASP coverage report
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

const SERVER_NAME = "kodeaman";
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
  console.error("KodeAman MCP server failed to start:", err);
  process.exit(1);
});
