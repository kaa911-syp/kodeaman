import { Command } from "commander";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import * as logger from "../utils/logger.js";

function prompt(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function promptYN(question: string, defaultYes = true): Promise<boolean> {
  const suffix = defaultYes ? "[Y/n]" : "[y/N]";
  return prompt(`${question} ${suffix} `).then((ans) => {
    if (!ans) return defaultYes;
    return ans.toLowerCase().startsWith("y");
  });
}

export function createInitCommand(): Command {
  const cmd = new Command("init")
    .description("Initialize KodeAman configuration in current directory")
    .action(async () => {
      try {
        logger.info("Initializing KodeAman configuration...\n");

        const language = await prompt(
          "Language / Bahasa (en/id) [id]: ",
        );
        const lang = language === "en" ? "en" : "id";

        const preset = await prompt(
          "Preset (laravel/node-express/wordpress) [none]: ",
        );
        const presets = preset ? [preset] : [];

        const useSemgrep = await promptYN("Enable Semgrep scanner?", true);
        const useZap = await promptYN("Enable ZAP baseline scanner?", false);

        let zapUrl: string | undefined;
        if (useZap) {
          zapUrl = await prompt("ZAP target URL: ");
        }

        const enableGamification = await promptYN(
          "Enable gamification (XP, badges, streaks)?",
          true,
        );

        const lines: string[] = [
          "# KodeAman Configuration",
          "# https://github.com/kodeaman/kodeaman",
          "",
          `language: ${lang}`,
          "",
          "scanners:",
          `  semgrep: ${useSemgrep}`,
          `  zapBaseline: ${useZap}`,
        ];

        if (zapUrl) {
          lines.push(`  zapTargetUrl: "${zapUrl}"`);
        }

        lines.push("");

        if (presets.length > 0) {
          lines.push("presets:");
          for (const p of presets) {
            lines.push(`  - ${p}`);
          }
          lines.push("");
        }

        lines.push("prioritization:");
        lines.push("  maxFindingsInComment: 3");
        lines.push("  failOnSeverity: critical");
        lines.push("");
        lines.push("gamification:");
        lines.push(`  enabled: ${enableGamification}`);
        lines.push("");
        lines.push("output:");
        lines.push("  markdown: true");
        lines.push("  sarif: false");
        lines.push("  json: false");
        lines.push("");

        const configPath = resolve(process.cwd(), ".kodeaman.yml");
        writeFileSync(configPath, lines.join("\n"), "utf-8");

        logger.success(`Configuration written to ${configPath}`);
        logger.info(
          lang === "id"
            ? 'Jalankan "kodeaman scan" untuk memulai pemindaian.'
            : 'Run "kodeaman scan" to start scanning.',
        );
      } catch (err) {
        logger.error(String(err));
        process.exit(1);
      }
    });

  return cmd;
}
