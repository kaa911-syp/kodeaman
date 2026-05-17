# @aspidasec/custom-rules

Custom rule engine for AspidaSec. It loads YAML or inline rule definitions, validates them with Zod, applies regex patterns to matching files, and emits `NormalizedFinding` results through the `CustomRuleScanner` adapter.

## Installation

```bash
pnpm add @aspidasec/custom-rules
```

## Usage

```ts
import { CustomRuleScanner, RuleLoader } from "@aspidasec/custom-rules";

const loader = new RuleLoader();
const validation = loader.validateDirectory(".aspidasec/rules");

const scanner = new CustomRuleScanner(loader);
const findings = await scanner.scan({ repoRoot: process.cwd() });
```

From the AspidaSec CLI:

```bash
aspidasec rules list
aspidasec rules validate
```

## API

- `RuleLoader` — loads `.yml` and `.yaml` files from a directory, validates inline config rules, and reports validation errors per file.
- `aspidasecRuleSchema` — Zod schema for `AspidaSecRule` definitions.
- `CustomRuleScanner` — scanner adapter with `name = "custom-rules"`; loads configured rules plus `.aspidasec/rules` and matches them against source files.
- `AspidaSecRule` — rule definition with bilingual title/description/remediation, severity, category, regex `pattern`, `fileGlob`, optional OWASP category, and optional CWE list.
- `CustomRulesConfig` — config shape for inline custom rules.
- `RuleValidationResult` — validation result containing validity, parsed rule, errors, and file path.

## License

Apache-2.0
