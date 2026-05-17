# @kodeaman/autofix

Automated fix runner for KodeAman scan findings. It collects `FixCommand` entries from normalized findings, deduplicates identical commands, supports dry-run previews, and skips breaking fixes unless explicitly enabled.

## Installation

```bash
pnpm add @kodeaman/autofix
```

## Usage

```ts
import { AutofixRunner } from "@kodeaman/autofix";

const runner = new AutofixRunner({ dryRun: true });
const report = await runner.run(findings);

console.log(report.fixableFindings, report.results);
```

From the KodeAman CLI:

```bash
kodeaman autofix
```

## API

- `AutofixRunner` — executes unique `fixCommands` from findings and returns an `AutofixReport`.
- `AutofixRunnerOptions` — constructor options: `dryRun` previews commands without execution, `includeBreaking` allows commands marked as breaking.
- `AutofixReport` — aggregate result with total, fixable, applied, failed, skipped counts, per-command results, and `generatedAt`.
- `AutofixResult` — per-command status: `success`, `failed`, `skipped`, or `dry-run`, plus output/error details.

## License

Apache-2.0
