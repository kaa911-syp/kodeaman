# Contributing to AspidaSec

Thank you for your interest in contributing to AspidaSec! This guide will help you get started.

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 10
- Git

### Setup

```bash
git clone https://github.com/kaa911-syp/AspidaSec.git
cd AspidaSec
pnpm install
pnpm build
```

### Development

```bash
pnpm dev        # Watch mode for all packages
pnpm test       # Run all tests
pnpm typecheck  # Type-check all packages
pnpm lint       # Lint all packages
```

## How to Contribute

### Reporting Bugs

1. Search existing issues to avoid duplicates.
2. Use the **Bug Report** issue template.
3. Include steps to reproduce, expected vs actual behavior, and your environment.

### Suggesting Features

1. Use the **Feature Request** issue template.
2. Describe the use case and how it benefits Indonesian developers.

### Submitting Pull Requests

1. Fork the repo and create a branch from `main`.
2. Follow the existing code style (enforced by Biome).
3. Write or update tests for your changes.
4. Ensure `pnpm test` and `pnpm typecheck` pass.
5. Write a clear PR description using the PR template.
6. Keep PRs focused — one feature or fix per PR.

## Code Style

- We use [Biome](https://biomejs.dev/) for formatting and linting.
- Run `pnpm format` to auto-format code.
- Indentation: 2 spaces.
- Use TypeScript strict mode.

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `chore:` — Maintenance
- `test:` — Adding or updating tests
- `refactor:` — Code refactoring

## Issue Labels

| Label | Description |
|-------|-------------|
| `good first issue` | Great for newcomers |
| `help wanted` | Looking for contributors |
| `area:cli` | CLI-related |
| `area:github-bot` | GitHub bot |
| `area:gitlab-bot` | GitLab bot |
| `area:coaching` | Coaching & education |
| `area:adapters` | Scanner adapters |

## Community

- Be respectful and inclusive.
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md).
- Questions? Open a [Discussion](https://github.com/kaa911-syp/AspidaSec/discussions).

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).
