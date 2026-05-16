import type { CookieInfo, CrawlResult, FormInfo, PlaywrightScanContext, SecurityHeaderCheck } from "./types.js";

type Browser = { newPage(): Promise<Page>; close(): Promise<void> };
type Page = {
  goto(url: string, options?: { waitUntil?: string; timeout?: number }): Promise<Response | null>;
  $$eval<T>(selector: string, pageFunction: (elements: unknown[]) => T): Promise<T>;
  context(): { cookies(): Promise<BrowserCookie[]> };
};
type Response = { headers(): Record<string, string> };
type BrowserCookie = { name: string; httpOnly: boolean; secure: boolean; sameSite?: "Strict" | "Lax" | "None"; url?: string };

type PlaywrightModule = {
  chromium: {
    launch(options?: { proxy?: { server: string } }): Promise<Browser>;
  };
};

const REQUIRED_HEADERS: Array<Omit<SecurityHeaderCheck, "url" | "present" | "value">> = [
  { header: "X-Content-Type-Options", severity: "low", recommendation: "Set X-Content-Type-Options to nosniff." },
  { header: "X-Frame-Options", severity: "medium", recommendation: "Set X-Frame-Options or frame-ancestors CSP to control framing." },
  { header: "Strict-Transport-Security", severity: "medium", recommendation: "Set Strict-Transport-Security on HTTPS responses." },
  { header: "Content-Security-Policy", severity: "medium", recommendation: "Set a Content-Security-Policy that limits script, frame, and object sources." },
];

export class PlaywrightCrawler {
  constructor(private readonly playwrightLoader: () => Promise<PlaywrightModule> = defaultPlaywrightLoader) {}

  async crawl(context: PlaywrightScanContext): Promise<CrawlResult> {
    if (!context.targetUrl) {
      throw new Error("playwrightTargetUrl must be configured when the Playwright scanner is enabled");
    }

    const playwright = await this.playwrightLoader();
    const browser = await playwright.chromium.launch({
      proxy: context.zapProxy ? { server: context.zapProxy } : undefined,
    });

    try {
      return await this.crawlWithBrowser(browser, context);
    } finally {
      await browser.close();
    }
  }

  private async crawlWithBrowser(browser: Browser, context: PlaywrightScanContext): Promise<CrawlResult> {
    const target = new URL(context.targetUrl!);
    const maxPages = context.maxPages ?? 20;
    const timeout = context.timeout ?? 30_000;
    const queue = [target.toString()];
    const seen = new Set<string>();
    const result: CrawlResult = { visitedUrls: [], securityHeaders: [], forms: [], cookies: [] };

    while (queue.length > 0 && seen.size < maxPages) {
      const url = queue.shift()!;
      if (seen.has(url)) continue;
      seen.add(url);

      const page = await browser.newPage();
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout });
      result.visitedUrls.push(url);

      if (response) {
        result.securityHeaders.push(...this.checkSecurityHeaders(url, response.headers()));
      }

      result.forms.push(...await this.detectForms(page, url));
      result.cookies.push(...this.mapCookies(await page.context().cookies(), url));

      const links = await page.$$eval("a[href]", (anchors) => anchors
        .map((anchor) => getStringProperty(anchor, "href"))
        .filter((href): href is string => Boolean(href)));
      for (const link of links) {
        const normalized = this.normalizeSameOriginUrl(link, target);
        if (normalized && !seen.has(normalized) && !queue.includes(normalized)) {
          queue.push(normalized);
        }
      }
    }

    return result;
  }

  private checkSecurityHeaders(url: string, headers: Record<string, string>): SecurityHeaderCheck[] {
    const normalized = new Map(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]));

    return REQUIRED_HEADERS
      .map((required) => ({
        ...required,
        url,
        present: normalized.has(required.header.toLowerCase()),
        value: normalized.get(required.header.toLowerCase()),
      }))
      .filter((check) => !check.present);
  }

  private async detectForms(page: Page, url: string): Promise<FormInfo[]> {
    return page.$$eval("form", (forms) => forms.map((form) => {
      const formRecord = form as {
        action?: string;
        method?: string;
        querySelectorAll(selector: string): ArrayLike<{ getAttribute(name: string): string | null }>;
      };
      const fields = Array.from(formRecord.querySelectorAll("input, textarea, select"));
      const fieldNames = fields
        .map((field) => field.getAttribute("name") ?? field.getAttribute("id") ?? "")
        .filter((name): name is string => Boolean(name));
      const hasCsrfToken = fieldNames.some((name) => /csrf|xsrf|token|authenticity/i.test(name));

      return {
        action: formRecord.action || undefined,
        method: (formRecord.method || "get").toUpperCase(),
        hasCsrfToken,
        fieldNames,
      };
    })).then((forms) => forms.map((form) => ({ ...form, url })));
  }

  private mapCookies(cookies: BrowserCookie[], url: string): CookieInfo[] {
    return cookies.map((cookie) => ({
      url: cookie.url ?? url,
      name: cookie.name,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
    }));
  }

  private normalizeSameOriginUrl(rawUrl: string, target: URL): string | undefined {
    try {
      const url = new URL(rawUrl, target);
      url.hash = "";
      if (url.origin !== target.origin) return undefined;
      return url.toString();
    } catch {
      return undefined;
    }
  }
}

function getStringProperty(value: unknown, property: string): string | undefined {
  if (!value || typeof value !== "object" || !(property in value)) return undefined;
  const propertyValue = (value as Record<string, unknown>)[property];
  return typeof propertyValue === "string" ? propertyValue : undefined;
}

async function defaultPlaywrightLoader(): Promise<PlaywrightModule> {
  try {
    return await import("playwright") as PlaywrightModule;
  } catch {
    throw new Error("Playwright is not installed. Install it with `pnpm add -D playwright` and run `pnpm exec playwright install chromium`.");
  }
}
