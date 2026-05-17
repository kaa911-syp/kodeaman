/**
 * Environment detection for OWASP scanning.
 *
 * Detects WSL, available scanners, and platform information.
 */

import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import type { FindingSource } from "@aspidasec/schema";

export interface ScannerInfo {
  name: string;
  source: FindingSource;
  available: boolean;
  path?: string;
  version?: string;
}

export interface EnvironmentInfo {
  platform: "linux" | "wsl" | "windows" | "macos";
  isWSL: boolean;
  wslDistro?: string;
  scanners: ScannerInfo[];
  nodeVersion: string;
  hasDocker: boolean;
  scannersAvailable: FindingSource[];
}

export interface WSLInstallInstructions {
  locale: "en" | "id";
  title: string;
  steps: string[];
  note: string;
}

export interface InstallInstructions {
  scanner: string;
  locale: "en" | "id";
  title: string;
  commands: string[];
  note: string;
}

export interface PreflightCheckResult {
  environment: EnvironmentInfo;
  missingScanners: ScannerInfo[];
  warnings: string[];
  installInstructions: InstallInstructions[];
  canRun: boolean;
}

/**
 * Detect if running inside WSL (Windows Subsystem for Linux).
 */
export function detectWSL(): { isWSL: boolean; distro?: string } {
  // Check WSL_DISTRO_NAME environment variable
  const distroEnv = process.env["WSL_DISTRO_NAME"];
  if (distroEnv) {
    return { isWSL: true, distro: distroEnv };
  }

  // Check /proc/version for Microsoft/WSL indicators
  try {
    if (existsSync("/proc/version")) {
      const version = readFileSync("/proc/version", "utf-8");
      if (/microsoft|wsl/i.test(version)) {
        return { isWSL: true, distro: distroEnv ?? undefined };
      }
    }
  } catch {
    // Not available, not WSL
  }

  // Check WSLInterop
  try {
    if (existsSync("/proc/sys/fs/binfmt_misc/WSLInterop")) {
      return { isWSL: true, distro: distroEnv ?? undefined };
    }
  } catch {
    // Not available
  }

  return { isWSL: false };
}

/**
 * On Windows, check if WSL is installed and available.
 */
export function checkWSLAvailability(): {
  available: boolean;
  distros: string[];
} {
  if (process.platform !== "win32") {
    return { available: false, distros: [] };
  }

  try {
    const output = execSync("wsl --list --quiet", {
      encoding: "utf-8",
      timeout: 5000,
      stdio: ["pipe", "pipe", "pipe"],
    });

    const distros = output
      .split("\n")
      .map((line) => line.replace(/\0/g, "").trim())
      .filter((line) => line.length > 0);

    return { available: distros.length > 0, distros };
  } catch {
    return { available: false, distros: [] };
  }
}

/**
 * Get WSL installation instructions in English or Indonesian.
 */
export function getWSLInstallInstructions(
  locale: "en" | "id" = "en"
): WSLInstallInstructions {
  if (locale === "id") {
    return {
      locale: "id",
      title: "Petunjuk Instalasi WSL",
      steps: [
        "Buka PowerShell sebagai Administrator",
        'Jalankan: wsl --install -d Ubuntu',
        "Restart komputer Anda jika diminta",
        "Setelah restart, buka Ubuntu dari Start Menu",
        "Buat username dan password Linux Anda",
        "Jalankan: sudo apt update && sudo apt upgrade -y",
        "Instal alat pemindai keamanan yang diperlukan di dalam WSL",
      ],
      note: "WSL diperlukan untuk menjalankan pemindai keamanan berbasis Linux seperti Semgrep dan ZAP pada Windows.",
    };
  }

  return {
    locale: "en",
    title: "WSL Installation Instructions",
    steps: [
      "Open PowerShell as Administrator",
      'Run: wsl --install -d Ubuntu',
      "Restart your computer if prompted",
      "After restart, open Ubuntu from the Start Menu",
      "Create your Linux username and password",
      "Run: sudo apt update && sudo apt upgrade -y",
      "Install required security scanning tools inside WSL",
    ],
    note: "WSL is required to run Linux-based security scanners like Semgrep and ZAP on Windows.",
  };
}

/**
 * Detect which security scanners are available on the system.
 */
export function detectScanners(): ScannerInfo[] {
  const docker = checkScanner("docker", "docker", "docker --version");
  const zapBaseline = checkScanner("zap-baseline", "zap-baseline.py", "zap-baseline.py --version");

  const scanners: ScannerInfo[] = [
    checkScanner("semgrep", "semgrep", "semgrep --version"),
    zapBaseline.available
      ? zapBaseline
      : {
          ...zapBaseline,
          available: docker.available,
          path: docker.path,
          version: docker.version,
        },
    checkScanner("npm-audit", "npm", "npm --version"),
    docker,
  ];

  return scanners;
}

function checkScanner(
  name: string,
  command: string,
  versionCommand: string
): ScannerInfo {
  const source = mapNameToSource(name);

  try {
    // Try to find the command path
    const whichCmd = process.platform === "win32" ? "where" : "which";
    const path = execSync(`${whichCmd} ${command}`, {
      encoding: "utf-8",
      timeout: 5000,
      stdio: ["pipe", "pipe", "pipe"],
    }).trim().split("\n")[0];

    // Try to get version
    let version: string | undefined;
    try {
      version = execSync(versionCommand, {
        encoding: "utf-8",
        timeout: 5000,
        stdio: ["pipe", "pipe", "pipe"],
      }).trim().split("\n")[0];
    } catch {
      // Version check failed, but command exists
    }

    return { name, source, available: true, path, version };
  } catch {
    return { name, source, available: false };
  }
}

function mapNameToSource(name: string): FindingSource {
  switch (name) {
    case "semgrep":
      return "semgrep";
    case "zap-baseline":
      return "zap-baseline";
    case "npm-audit":
      return "npm-audit";
    default:
      return "custom";
  }
}

/**
 * Detect the full environment information.
 */
export function getInstallInstructions(
  scanner: string,
  locale: "en" | "id" = "en"
): InstallInstructions {
  const normalized = scanner === "zap-baseline.py" ? "zap-baseline" : scanner;

  if (normalized === "semgrep") {
    if (locale === "id") {
      return {
        scanner: normalized,
        locale,
        title: "Petunjuk Instalasi Semgrep",
        commands: [
          "pipx install semgrep",
          "python -m pip install semgrep",
          "brew install semgrep",
        ],
        note: "Gunakan pipx jika tersedia agar Semgrep terpasang sebagai CLI terisolasi. Di macOS, Homebrew juga didukung.",
      };
    }

    return {
      scanner: normalized,
      locale,
      title: "Semgrep Installation Instructions",
      commands: [
        "pipx install semgrep",
        "python -m pip install semgrep",
        "brew install semgrep",
      ],
      note: "Prefer pipx when available so Semgrep is installed as an isolated CLI. Homebrew is also supported on macOS.",
    };
  }

  if (normalized === "zap-baseline") {
    if (locale === "id") {
      return {
        scanner: normalized,
        locale,
        title: "Petunjuk Instalasi ZAP Baseline",
        commands: ["docker pull ghcr.io/zaproxy/zaproxy:stable"],
        note: "AspidaSec dapat menjalankan ZAP Baseline lewat Docker, jadi pastikan perintah docker tersedia di PATH dan daemon Docker sedang berjalan.",
      };
    }

    return {
      scanner: normalized,
      locale,
      title: "ZAP Baseline Installation Instructions",
      commands: ["docker pull ghcr.io/zaproxy/zaproxy:stable"],
      note: "AspidaSec can run ZAP Baseline through Docker, so make sure the docker command is on PATH and the Docker daemon is running.",
    };
  }

  if (normalized === "npm" || normalized === "npm-audit") {
    if (locale === "id") {
      return {
        scanner: "npm-audit",
        locale,
        title: "Petunjuk Instalasi npm",
        commands: ["Install Node.js LTS dari https://nodejs.org/"],
        note: "npm disertakan bersama Node.js dan diperlukan untuk menjalankan npm audit pada proyek JavaScript/TypeScript.",
      };
    }

    return {
      scanner: "npm-audit",
      locale,
      title: "npm Installation Instructions",
      commands: ["Install Node.js LTS from https://nodejs.org/"],
      note: "npm ships with Node.js and is required to run npm audit for JavaScript/TypeScript projects.",
    };
  }

  return {
    scanner: normalized,
    locale,
    title: locale === "id" ? `Petunjuk Instalasi ${normalized}` : `${normalized} Installation Instructions`,
    commands: [],
    note: locale === "id"
      ? "Pastikan perintah CLI tersedia di PATH sebelum menjalankan pemindaian."
      : "Make sure the CLI command is available on PATH before running the scan.",
  };
}

export function preflightCheck(
  locale: "en" | "id" = "en",
  environment: EnvironmentInfo = detectEnvironment()
): PreflightCheckResult {
  const missingScanners = environment.scanners.filter(
    (scanner) => scanner.name !== "docker" && !scanner.available
  );
  const warnings = missingScanners.map((scanner) =>
    locale === "id"
      ? `Pemindai ${scanner.name} tidak tersedia di PATH.`
      : `Scanner ${scanner.name} is not available on PATH.`
  );

  return {
    environment,
    missingScanners,
    warnings,
    installInstructions: missingScanners.map((scanner) =>
      getInstallInstructions(scanner.name, locale)
    ),
    canRun: missingScanners.length < environment.scanners.filter((scanner) => scanner.name !== "docker").length,
  };
}

export function detectEnvironment(): EnvironmentInfo {
  const wsl = detectWSL();
  const scanners = detectScanners();
  const hasDocker = scanners.some(
    (s) => s.name === "docker" && s.available
  );

  let platform: EnvironmentInfo["platform"];
  if (wsl.isWSL) {
    platform = "wsl";
  } else if (process.platform === "win32") {
    platform = "windows";
  } else if (process.platform === "darwin") {
    platform = "macos";
  } else {
    platform = "linux";
  }

  const scannersAvailable: FindingSource[] = scanners
    .filter((s) => s.available && s.source !== "custom")
    .map((s) => s.source);

  return {
    platform,
    isWSL: wsl.isWSL,
    wslDistro: wsl.distro,
    scanners,
    nodeVersion: process.version,
    hasDocker,
    scannersAvailable,
  };
}
