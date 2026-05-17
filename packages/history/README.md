# @kodeaman/history

Scan history storage and team collaboration types for KodeAman. It persists scan summaries as JSONL, supports date and project filtering, aggregates daily trends, and summarizes project scan history.

## Installation

```bash
pnpm add @kodeaman/history
```

## Usage

```ts
import { ScanHistoryStore } from "@kodeaman/history";

const store = new ScanHistoryStore(".kodeaman/history.jsonl");
await store.append(scanHistoryEntry);

const recent = await store.query({ since: new Date("2026-01-01") });
const trends = await store.getTrends(30);
```

From the KodeAman CLI:

```bash
kodeaman history show
kodeaman history trends
kodeaman history export
```

## API

- `ScanHistoryStore` — appends scan history entries, reads all entries, filters by date/project, aggregates daily trends, and computes project stats.
- `ScanHistoryEntry` — persisted scan summary with timestamp, project path, scan mode, severity/category counts, top findings, scanners used, and coverage percentage.
- `ScanHistoryQueryOptions` — filters for `since`, `until`, and `projectPath`.
- `DailyTrend` — per-day scan count, finding count, and severity totals.
- `ProjectStats` — per-project scan count, finding count, last scan timestamp, and average coverage percentage.
- `ScanMode` — scan mode value: `standard` or `owasp`.
- `TeamConfig` — collaboration config containing team metadata, members, roles, and projects.

## License

Apache-2.0
