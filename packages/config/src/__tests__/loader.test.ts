import { describe, it, expect } from "vitest";
import { loadConfigFromString, DEFAULT_CONFIG } from "../index.js";

describe("ConfigLoader", () => {
  it("should return defaults when given empty content", () => {
    const config = loadConfigFromString("");
    expect(config).toEqual(DEFAULT_CONFIG);
  });

  it("should return defaults when given null YAML", () => {
    const config = loadConfigFromString("---\n");
    expect(config).toEqual(DEFAULT_CONFIG);
  });

  it("should merge partial config with defaults", () => {
    const yaml = `
language: en
scanners:
  semgrep: false
`;
    const config = loadConfigFromString(yaml);
    expect(config.language).toBe("en");
    expect(config.scanners.semgrep).toBe(false);
    expect(config.scanners.zapBaseline).toBe(false);
    expect(config.gamification.enabled).toBe(true);
  });

  it("should override nested values", () => {
    const yaml = `
prioritization:
  maxFindingsInComment: 5
  failOnSeverity: high
gamification:
  enabled: false
`;
    const config = loadConfigFromString(yaml);
    expect(config.prioritization.maxFindingsInComment).toBe(5);
    expect(config.prioritization.failOnSeverity).toBe("high");
    expect(config.gamification.enabled).toBe(false);
  });

  it("should handle presets array", () => {
    const yaml = `
presets:
  - laravel
  - node-express
`;
    const config = loadConfigFromString(yaml);
    expect(config.presets).toEqual(["laravel", "node-express"]);
  });

  it("should handle output configuration", () => {
    const yaml = `
output:
  markdown: true
  sarif: true
  json: true
`;
    const config = loadConfigFromString(yaml);
    expect(config.output.markdown).toBe(true);
    expect(config.output.sarif).toBe(true);
    expect(config.output.json).toBe(true);
  });

  it("should handle LLM configuration", () => {
    const yaml = `
llm:
  enabled: true
  provider: openai
`;
    const config = loadConfigFromString(yaml);
    expect(config.llm?.enabled).toBe(true);
    expect(config.llm?.provider).toBe("openai");
  });

  it("should throw on invalid language", () => {
    const yaml = `language: fr`;
    expect(() => loadConfigFromString(yaml)).toThrow("Invalid language");
  });

  it("should throw on invalid failOnSeverity", () => {
    const yaml = `
prioritization:
  failOnSeverity: extreme
`;
    expect(() => loadConfigFromString(yaml)).toThrow("Invalid failOnSeverity");
  });

  it("should throw on maxFindingsInComment < 1", () => {
    const yaml = `
prioritization:
  maxFindingsInComment: 0
`;
    expect(() => loadConfigFromString(yaml)).toThrow(
      "maxFindingsInComment must be at least 1",
    );
  });
});
