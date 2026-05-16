import { describe, it, expect } from "vitest";
import { loadPreset, listPresets, getPresetForFramework } from "../loader.js";

describe("loadPreset", () => {
  it("loads the laravel preset", () => {
    const preset = loadPreset("laravel");
    expect(preset.name).toBe("laravel");
    expect(preset.framework).toBe("laravel");
    expect(preset.frameworkHints).toContain("php");
    expect(preset.frameworkHints).toContain("laravel");
    expect(preset.semgrepRules.length).toBeGreaterThan(0);
    expect(preset.priorityOverrides["sqli"]).toBeDefined();
  });

  it("loads the node-express preset", () => {
    const preset = loadPreset("node-express");
    expect(preset.name).toBe("node-express");
    expect(preset.framework).toBe("express");
    expect(preset.frameworkHints).toContain("javascript");
    expect(preset.frameworkHints).toContain("node");
    expect(preset.semgrepRules.length).toBeGreaterThan(0);
  });

  it("loads the wordpress preset", () => {
    const preset = loadPreset("wordpress");
    expect(preset.name).toBe("wordpress");
    expect(preset.framework).toBe("wordpress");
    expect(preset.frameworkHints).toContain("wordpress");
    expect(preset.semgrepRules.length).toBeGreaterThan(0);
  });

  it("throws for unknown preset name", () => {
    expect(() => loadPreset("django")).toThrow('Unknown preset "django"');
  });
});

describe("listPresets", () => {
  it("returns all preset names", () => {
    const names = listPresets();
    expect(names).toContain("laravel");
    expect(names).toContain("node-express");
    expect(names).toContain("wordpress");
    expect(names).toHaveLength(3);
  });
});

describe("getPresetForFramework", () => {
  it("detects Laravel from framework hints", () => {
    const preset = getPresetForFramework(["php", "laravel"]);
    expect(preset?.name).toBe("laravel");
  });

  it("detects Express from framework hints", () => {
    const preset = getPresetForFramework(["javascript", "express"]);
    expect(preset?.name).toBe("node-express");
  });

  it("detects WordPress from framework hints", () => {
    const preset = getPresetForFramework(["wordpress"]);
    expect(preset?.name).toBe("wordpress");
  });

  it("is case insensitive", () => {
    const preset = getPresetForFramework(["Laravel", "PHP"]);
    expect(preset?.name).toBe("laravel");
  });

  it("returns undefined for unknown framework", () => {
    const preset = getPresetForFramework(["django", "python"]);
    expect(preset).toBeUndefined();
  });
});
