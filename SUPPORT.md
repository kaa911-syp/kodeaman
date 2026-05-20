# Support

## Getting Help

### Documentation

- [Architecture Overview](docs/architecture/overview.md)
- [Self-Hosting Guide (GitHub)](docs/self-hosting/github.md)
- [Self-Hosting Guide (GitLab)](docs/self-hosting/gitlab.md)

### Community

- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/kaa911-syp/AspidaSec/discussions)
- **GitHub Issues**: [Report bugs or request features](https://github.com/kaa911-syp/AspidaSec/issues)

### Indonesian Developer Communities

- Telegram: Laravel Indonesia, PHP Indonesia, IDDevOps
- Discord: Google Developer Community Indonesia

## Frequently Asked Questions

**Q: Do I need Semgrep/ZAP installed to use AspidaSec?**
A: AspidaSec can run with `--input` flag to process pre-existing scanner output. For full automated scanning, you need Semgrep installed. ZAP is optional.

**Q: Can I use AspidaSec with self-hosted GitLab?**
A: Yes! AspidaSec supports self-hosted GitLab via webhook integration. See the self-hosting guide.

**Q: Is AspidaSec free?**
A: The open-source core is free under Apache License 2.0. Optional team features may be offered as a paid service in the future.

**Q: Can I add my own scanner?**
A: Yes! Implement the `ScannerAdapter` interface from `@aspidasec/core` and register it with the pipeline.

## Security Issues

For security vulnerabilities, please see [SECURITY.md](SECURITY.md).
