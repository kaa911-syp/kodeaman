import { describe, it, expect } from "vitest";
import {
  detectEnvironment,
  getInstallInstructions,
  preflightCheck,
  type EnvironmentInfo,
} from "../environment.js";

function makeEnvironment(scanners: EnvironmentInfo["scanners"]): EnvironmentInfo {
  return {
    platform: "linux",
    isWSL: false,
    scanners,
    nodeVersion: "v22.0.0",
    hasDocker: scanners.some((scanner) => scanner.name === "docker" && scanner.available),
    scannersAvailable: scanners
      .filter((scanner) => scanner.available && scanner.source !== "custom")
      .map((scanner) => scanner.source),
  };
}

describe("environment preflight checks", () => {
  it("returns Semgrep install instructions in English and Indonesian", () => {
    const en = getInstallInstructions("semgrep", "en");
    const id = getInstallInstructions("semgrep", "id");

    expect(en.title).toContain("Semgrep");
    expect(en.commands).toContain("pipx install semgrep");
    expect(en.commands).toContain("python -m pip install semgrep");
    expect(en.commands).toContain("brew install semgrep");
    expect(id.title).toContain("Semgrep");
    expect(id.note).toContain("pipx");
  });

  it("returns Docker-based ZAP Baseline instructions", () => {
    const instructions = getInstallInstructions("zap-baseline", "en");

    expect(instructions.title).toContain("ZAP Baseline");
    expect(instructions.commands).toContain("docker pull ghcr.io/zaproxy/zaproxy:stable");
    expect(instructions.note).toContain("Docker");
  });

  it("returns npm install instructions through Node.js", () => {
    const instructions = getInstallInstructions("npm-audit", "id");

    expect(instructions.scanner).toBe("npm-audit");
    expect(instructions.commands[0]).toContain("https://nodejs.org/");
    expect(instructions.note).toContain("Node.js");
  });

  it("reports missing scanners with actionable instructions", () => {
    const environment = makeEnvironment([
      { name: "semgrep", source: "semgrep", available: false },
      { name: "zap-baseline", source: "zap-baseline", available: true, path: "docker" },
      { name: "npm-audit", source: "npm-audit", available: true, path: "npm" },
      { name: "docker", source: "custom", available: true, path: "docker" },
    ]);

    const result = preflightCheck("en", environment);

    expect(result.environment).toBe(environment);
    expect(result.missingScanners).toHaveLength(1);
    expect(result.warnings[0]).toContain("semgrep");
    expect(result.installInstructions[0].commands).toContain("pipx install semgrep");
    expect(result.canRun).toBe(true);
  });

  it("marks preflight as unable to run when every non-docker scanner is missing", () => {
    const environment = makeEnvironment([
      { name: "semgrep", source: "semgrep", available: false },
      { name: "zap-baseline", source: "zap-baseline", available: false },
      { name: "npm-audit", source: "npm-audit", available: false },
      { name: "docker", source: "custom", available: false },
    ]);

    const result = preflightCheck("id", environment);

    expect(result.missingScanners).toHaveLength(3);
    expect(result.installInstructions.map((instructions) => instructions.scanner)).toEqual([
      "semgrep",
      "zap-baseline",
      "npm-audit",
    ]);
    expect(result.canRun).toBe(false);
  });

  it("detects the current environment shape", () => {
    const environment = detectEnvironment();

    expect(environment).toHaveProperty("platform");
    expect(environment).toHaveProperty("scanners");
    expect(environment.scanners.some((scanner) => scanner.name === "semgrep")).toBe(true);
    expect(environment.scanners.some((scanner) => scanner.name === "zap-baseline")).toBe(true);
    expect(environment.scanners.some((scanner) => scanner.name === "npm-audit")).toBe(true);
  });
});
