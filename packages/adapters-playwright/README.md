# @aspidasec/adapters-playwright

Playwright-based DAST adapter for AspidaSec. It crawls a target site with Chromium, checks runtime browser security controls, and converts missing headers, unsafe forms, and weak cookie attributes into `NormalizedFinding` results.

## Installation

```bash
pnpm add @aspidasec/adapters-playwright
pnpm add -D playwright
pnpm exec playwright install chromium
```

## Usage

```ts
import { PlaywrightAdapter } from "@aspidasec/adapters-playwright";

const adapter = new PlaywrightAdapter();
const findings = await adapter.scan({
  targetUrl: "https://example.test",
  maxPages: 10,
  timeout: 30_000,
});
```

## API

- `PlaywrightAdapter` — scanner adapter with `name = "playwright"`; `scan(context, repoContext?)` returns normalized findings from a browser crawl.
- `PlaywrightCrawler` — launches Chromium, optionally through `zapProxy`, crawls same-origin links, and records visited URLs, security header checks, forms, and cookies.
- `ScannerAdapter` — adapter interface implemented by `PlaywrightAdapter`.
- `PlaywrightScanContext` — scan options: `repoRoot`, `targetUrl`, `zapProxy`, `maxPages`, and `timeout`.
- `CrawlResult` — crawl output containing `visitedUrls`, `securityHeaders`, `forms`, and `cookies`.
- `SecurityHeaderCheck`, `FormInfo`, `CookieInfo` — structured runtime observations used to build findings.

## License

Apache-2.0
