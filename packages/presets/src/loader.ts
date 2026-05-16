import type { PresetConfig } from "./types.js";
import { laravelPreset } from "./presets/laravel.js";
import { nodeExpressPreset } from "./presets/node-express.js";
import { wordpressPreset } from "./presets/wordpress.js";

const presetRegistry: Record<string, PresetConfig> = {
  laravel: laravelPreset,
  "node-express": nodeExpressPreset,
  wordpress: wordpressPreset,
};

export function loadPreset(name: string): PresetConfig {
  const preset = presetRegistry[name];
  if (!preset) {
    const available = Object.keys(presetRegistry).join(", ");
    throw new Error(`Unknown preset "${name}". Available presets: ${available}`);
  }
  return preset;
}

export function listPresets(): string[] {
  return Object.keys(presetRegistry);
}

export function getPresetForFramework(hints: string[]): PresetConfig | undefined {
  const lower = hints.map((h) => h.toLowerCase());
  for (const preset of Object.values(presetRegistry)) {
    if (preset.frameworkHints.some((h) => lower.includes(h))) {
      return preset;
    }
  }
  return undefined;
}
