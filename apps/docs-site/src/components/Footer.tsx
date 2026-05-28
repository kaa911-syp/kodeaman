import { KawungMark } from './Mark'
import { docs } from '../site'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Evidence ledger', href: '#evidence' },
      { label: 'Exhibit finding', href: '#exhibit' },
      { label: 'Scanners index', href: '#index' },
      { label: 'Install', href: '#install' },
      { label: 'Repo', href: 'https://github.com/kaa911-syp/AspidaSec', external: true },
    ],
  },
  {
    title: 'Docs',
    links: [
      { label: 'Quickstart', href: docs('/get-started/quickstart'), external: true },
      { label: 'Architecture', href: docs('/concepts/architecture'), external: true },
      { label: 'GitHub bot', href: docs('/integrations/github-bot'), external: true },
      { label: 'MCP integration', href: docs('/integrations/mcp-overview'), external: true },
      { label: 'SARIF / IDEs', href: docs('/integrations/sarif-ide'), external: true },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub', href: 'https://github.com/kaa911-syp/AspidaSec', external: true },
      { label: 'Discussions', href: 'https://github.com/kaa911-syp/AspidaSec/discussions', external: true },
      { label: 'Issues', href: 'https://github.com/kaa911-syp/AspidaSec/issues', external: true },
      { label: 'License (Apache 2.0)', href: 'https://github.com/kaa911-syp/AspidaSec/blob/main/LICENSE', external: true },
    ],
  },
] as const

export function Footer() {
  return (
    <footer className="footer2">
      <div className="container">
        <div className="footer-grid2">
          <div>
            <div className="brand" style={{ marginBottom: 18 }}>
              <KawungMark size={28} />
              <span className="word">
                ASPIDA<span className="dim">·SEC</span>
              </span>
            </div>
            <p className="footer-tag">
              Evidence-first website security scanning with practical remediation guidance.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              <div className="footer-links2">
                {col.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    {...('external' in l && l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="footer-bottom2">
          <span>
            <b>Apache 2.0</b> · 2026 AspidaSec
          </span>
        </div>
      </div>
    </footer>
  )
}
