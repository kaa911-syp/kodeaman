export interface SemgrepPosition {
  line: number;
  col: number;
  offset: number;
}

export interface SemgrepExtra {
  message: string;
  severity: string;
  metadata: {
    category?: string;
    technology?: string[];
    cwe?: string[];
    owasp?: string[];
    confidence?: string;
    impact?: string;
    likelihood?: string;
    references?: string[];
    source?: string;
    shortlink?: string;
    [key: string]: unknown;
  };
  lines: string;
  is_ignored?: boolean;
  fix?: string;
  fix_regex?: {
    regex: string;
    replacement: string;
    count?: number;
  };
}

export interface SemgrepResult {
  check_id: string;
  path: string;
  start: SemgrepPosition;
  end: SemgrepPosition;
  extra: SemgrepExtra;
}

export interface SemgrepError {
  code: number;
  level: string;
  type: string;
  message: string;
  path?: string;
  long_msg?: string;
  short_msg?: string;
  spans?: unknown[];
}

export interface SemgrepRawOutput {
  version?: string;
  results: SemgrepResult[];
  errors: SemgrepError[];
  paths?: {
    scanned: string[];
    skipped?: unknown[];
  };
}

export interface ScanContext {
  targetPath: string;
  configPath?: string;
  rules?: string[];
  extraArgs?: string[];
  timeout?: number;
}
