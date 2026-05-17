# @aspidasec/history

Scan history storage and team collaboration types for AspidaSec. It persists scan summaries as JSONL, supports date and project filtering, aggregates daily trends, and summarizes project scan history.

## Installation

```bash
pnpm add @aspidasec/history
```

## Usage

```ts
import { ScanHistoryStore } from "@aspidasec/history";

const store = new ScanHistoryStore(".aspidasec/history.jsonl");
await store.append(scanHistoryEntry);

const recent = await store.query({ since: new Date("2026-01-01") });
const trends = await store.getTrends(30);
```

From the AspidaSec CLI:

```bash
aspidasec history show
aspidasec history trends
aspidasec history export
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
