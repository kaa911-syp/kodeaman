export interface PlaywrightScanContext {
  repoRoot?: string;
  targetUrl?: string;
  zapProxy?: string;
  maxPages?: number;
  timeout?: number;
}

export interface SecurityHeaderCheck {
  url: string;
  header: "X-Content-Type-Options" | "X-Frame-Options" | "Strict-Transport-Security" | "Content-Security-Policy";
  present: boolean;
  value?: string;
  severity: "low" | "medium";
  recommendation: string;
}

export interface FormInfo {
  url: string;
  action?: string;
  method: string;
  hasCsrfToken: boolean;
  fieldNames: string[];
}

export interface CookieInfo {
  url: string;
  name: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

export interface CrawlResult {
  visitedUrls: string[];
  securityHeaders: SecurityHeaderCheck[];
  forms: FormInfo[];
  cookies: CookieInfo[];
}
