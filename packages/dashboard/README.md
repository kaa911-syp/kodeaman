# @kodeaman/dashboard

Lightweight self-contained web dashboard for KodeAman telemetry. It serves an HTML dashboard with SVG trend charts, OWASP coverage, recent scan summaries, finding details, and light/dark theme support.

## Installation

```bash
pnpm add @kodeaman/dashboard
```

## Usage

```ts
import { DashboardServer } from "@kodeaman/dashboard";

const server = new DashboardServer({
  port: 4800,
  dataDir: ".kodeaman/telemetry",
});

await server.start();
```

From the KodeAman CLI:

```bash
kodeaman dashboard --port 4800
```

## API

- `DashboardServer` — HTTP server for `/`, `/api/scans`, `/api/trends`, and `/api/findings/:scanId`.
- `DashboardServerOptions` — server options: `port` defaults to `4800`, `dataDir` defaults to `.kodeaman/telemetry`.
- `DashboardApiPayload` — aggregate payload shape for dashboard scan and trend data.
- `TelemetryReader` — reads telemetry JSONL files recursively, builds scan summaries, aggregates trends, and returns findings by scan ID.
- `generateDashboardHtml` — returns the self-contained dashboard HTML document.
- `DashboardScanEntry`, `DashboardScanSummary`, `DashboardTrendPoint` — dashboard data structures used by the reader and API.

## License

Apache-2.0
