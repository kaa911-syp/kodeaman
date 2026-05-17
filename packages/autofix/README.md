# @aspidasec/autofix

Automated fix runner for AspidaSec scan findings. It collects `FixCommand` entries from normalized findings, deduplicates identical commands, supports dry-run previews, and skips breaking fixes unless explicitly enabled.

## Installation

```bash
pnpm add @aspidasec/autofix
```

## Usage

```ts
import { AutofixRunner } from "@aspidasec/autofix";

const runner = new AutofixRunner({ dryRun: true });
const report = await runner.run(findings);

console.log(report.fixableFindings, report.results);
```

From the AspidaSec CLI:

```bash
aspidasec autofix
```

## API

- `AutofixRunner` — executes unique `fixCommands` from findings and returns an `AutofixReport`.
- `AutofixRunnerOptions` — constructor options: `dryRun` previews commands without execution, `includeBreaking` allows commands marked as breaking.
- `AutofixReport` — aggregate result with total, fixable, applied, failed, skipped counts, per-command results, and `generatedAt`.
- `AutofixResult` — per-command status: `success`, `failed`, `skipped`, or `dry-run`, plus output/error details.

## License

Apache-2.0
