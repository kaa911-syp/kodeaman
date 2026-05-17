# @kodeaman/watcher

Real-time file watcher for KodeAman scans. It monitors a project path recursively, filters changes with include/exclude globs, debounces rapid filesystem events, and emits change events suitable for triggering scans.

## Installation

```bash
pnpm add @kodeaman/watcher
```

## Usage

```ts
import { FileWatcher } from "@kodeaman/watcher";

const watcher = new FileWatcher({
  path: process.cwd(),
  debounceMs: 500,
  include: ["src/**/*"],
  exclude: ["**/*.test.ts"],
});

watcher.on("change", (event) => {
  console.log(event.eventType, event.path);
});

watcher.start();
```

From the KodeAman CLI:

```bash
kodeaman watch .
```

## API

- `FileWatcher` — `EventEmitter` that starts and stops recursive filesystem watching and emits debounced `change` events.
- `WatcherOptions` — watcher configuration: `path`, optional `debounceMs`, optional `include` globs, and optional `exclude` globs.
- `FileChangeEvent` — emitted event containing absolute changed `path` and filesystem `eventType` (`rename` or `change`).

## License

Apache-2.0
