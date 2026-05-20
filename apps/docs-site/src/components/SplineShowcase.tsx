import { ScrollReveal } from './animations'
import { CircleSlash, FileSearch, GitBranch, ListChecks, Wrench } from 'lucide-react'

const scopeItems = [
  { title: 'Scan', detail: 'Dynamic checks, dependency audit, secrets review, crawler coverage', icon: FileSearch },
  { title: 'Prioritize', detail: 'Severity, exposure, exploitability, confidence, fix availability', icon: ListChecks },
  { title: 'Guide', detail: 'Evidence-first explanations with practical remediation examples', icon: Wrench },
  { title: 'Integrate', detail: 'Markdown, HTML, JSON, SARIF, CI result, and PR comment output', icon: GitBranch },
]

const exclusions = ['No attack labs', 'No dashboards yet', 'No invented AI findings', 'No broad security ecosystem']

export function SplineShowcase() {
  return (
    <section className="relative z-10 -mt-24 border-y border-white/10 bg-[#06100f] px-6 py-20 sm:-mt-32 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(52,211,153,0.12),transparent_42%),radial-gradient(circle_at_90%_10%,rgba(59,130,246,0.14),transparent_36%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
        <ScrollReveal>
          <h2 className="max-w-xl text-4xl font-semibold tracking-normal text-white sm:text-5xl">
            A focused website security scanner, not a scattered security platform.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400">
            The GitHub Pages site now mirrors the product boundary: scan web apps, rank the risk, explain the evidence, and produce output developers can act on.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {exclusions.map((item) => (
              <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/22 px-3 py-2 text-xs font-medium text-zinc-300">
                <CircleSlash className="h-3.5 w-3.5 text-red-300" />
                {item}
              </span>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
          {scopeItems.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="min-h-48 bg-[#06100f]/96 p-6 sm:p-7">
                <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{item.detail}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
