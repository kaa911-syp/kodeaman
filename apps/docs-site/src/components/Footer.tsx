import { GitBranch, ShieldCheck } from 'lucide-react'

const columns = [
  { title: 'Product', links: [{ label: 'Scanner', href: '#features' }, { label: 'Workflow', href: '#how-it-works' }, { label: 'CLI', href: '#get-started' }] },
  { title: 'Docs', links: [{ label: 'Getting Started', href: '#get-started' }, { label: 'Architecture', href: '#features' }, { label: 'Trust Model', href: '#report-preview' }] },
  { title: 'Source', links: [{ label: 'GitHub', href: 'https://github.com/kaa911-syp/AspidaSec' }, { label: 'Apache 2.0 License', href: 'https://github.com/kaa911-syp/AspidaSec' }] },
]

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 py-14 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/25 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/25 bg-emerald-300/10 text-emerald-200">
                <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h2 className="text-xl font-semibold text-white">AspidaSec</h2>
            </div>
            <p className="mt-5 max-w-sm text-base leading-7 text-zinc-400">
              Developer-first website security scanning with evidence-backed prioritization and practical remediation guidance.
            </p>
            <a href="https://github.com/kaa911-syp/AspidaSec" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 transition hover:text-emerald-100">
              <GitBranch className="h-4 w-4" />
              Open repository
            </a>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-300">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-zinc-400 transition hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-zinc-500">
          Copyright 2026 Vibellabbs Code. Website security scanner for developers.
        </div>
      </div>
    </footer>
  )
}
