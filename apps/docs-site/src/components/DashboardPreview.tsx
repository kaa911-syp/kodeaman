import { ScrollReveal } from './animations'
import { AlertTriangle, CheckCircle, ExternalLink, FileText, LockKeyhole, ShieldAlert } from 'lucide-react'

const rows = [
  { label: 'A01 Broken Access Control', severity: 'Critical', asset: '/api/session', status: 'Fix first' },
  { label: 'A03 Injection', severity: 'High', asset: '/search?q=', status: 'Reproduce' },
  { label: 'A05 Security Misconfiguration', severity: 'Medium', asset: 'headers', status: 'Quick fix' },
]

const remediation = [
  'Confirm authorization checks on every state-changing endpoint.',
  'Add regression tests for denied cross-tenant access.',
  'Return generic errors and remove leaked object identifiers.',
]

export function DashboardPreview() {
  return (
    <section id="report-preview" className="relative bg-[#07110f] px-6 py-24 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,7,0),rgba(52,211,153,0.06)_42%,rgba(3,6,7,0))]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <ScrollReveal>
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
            <FileText className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <h2 className="text-4xl font-semibold tracking-normal text-white sm:text-5xl">
            Reports built for fixing, not collecting screenshots.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-zinc-400">
            AspidaSec output should make the next action obvious: what is real, where it lives, why it matters, and what the developer should change first.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#06100f] shadow-[0_28px_110px_rgba(0,0,0,0.42)]">
            <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.035] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">AspidaSec HTML Report</p>
                <p className="mt-1 text-xs text-zinc-500">Scan target: https://app.example.com</p>
              </div>
              <a href="#get-started" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:border-emerald-300/35">
                Export Markdown
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="grid gap-px bg-white/10 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="bg-[#06100f] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Top 3 risks</h3>
                  <span className="rounded-full bg-red-400/12 px-3 py-1 text-xs font-semibold text-red-200">production blocking</span>
                </div>
                <div className="space-y-3">
                  {rows.map((row) => (
                    <div key={row.label} className="grid gap-3 rounded-xl border border-white/10 bg-black/24 p-4 sm:grid-cols-[1fr_auto]">
                      <div>
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="h-4 w-4 text-red-300" />
                          <p className="text-sm font-semibold text-white">{row.label}</p>
                        </div>
                        <p className="mt-2 text-xs text-zinc-500">{row.asset}</p>
                      </div>
                      <div className="flex items-center gap-2 sm:block sm:text-right">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-200">{row.severity}</p>
                        <p className="mt-0 text-xs text-emerald-200 sm:mt-2">{row.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#06100f] p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
                    <LockKeyhole className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Fix guidance</h3>
                    <p className="text-xs text-zinc-500">Generated only from scanner evidence</p>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/24 p-4">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-amber-200">
                    <AlertTriangle className="h-4 w-4" />
                    Likely exploitable
                  </div>
                  <ul className="space-y-3">
                    {remediation.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-300">
                        <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
