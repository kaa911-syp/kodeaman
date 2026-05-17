# @kodeaman/telemetry

Local scan telemetry writer for KodeAman validation output. It collects scan result summaries, scanner names, finding counts, timing data, and findings, then writes them as JSON or append-friendly JSONL events.

## Installation

```bash
pnpm add @kodeaman/telemetry
```

## Usage

```ts
import { TelemetryWriter } from "@kodeaman/telemetry";

const writer = new TelemetryWriter({
  outputPath: ".kodeaman/telemetry/scans.jsonl",
  append: true,
});

await writer.write(scanResult, { scanId: "local-001" });
```

## API

- `TelemetryCollector` — converts a scan result, OWASP scan report, or finding array into a `TelemetryEvent` with summary counts and scanner metadata.
- `TelemetryWriter` — writes collected telemetry to `outputPath`; infers `jsonl` for `.jsonl` paths and supports append mode.
- `TelemetryWriterOptions` — writer options: `outputPath`, optional `format`, and optional `append`.
- `TelemetryInput` — accepted input: `ScanResult`, `OwaspScanReport`, or `NormalizedFinding[]`.
- `TelemetryEvent` — persisted event with schema version, event type, generated timestamp, summary, findings, and optional metadata.
- `TelemetryScanSummary` — total findings, severity counts, scanner list, and optional scan duration.
- `TelemetryFormat` — output format: `json` or `jsonl`.

## License

Apache-2.0
