import { Activity, FileCheck, Gauge, GitPullRequest, Languages, SearchCode, ShieldCheck } from 'lucide-react'
import { StaggerContainer, StaggerItem } from './animations'

const features = [
  {
    title: 'OWASP-oriented scanning',
    description: 'Coordinate ZAP, Semgrep, dependency audit, Playwright crawling, and config review around website risk instead of disconnected raw scanner output.',
    icon: SearchCode,
    meta: 'scanner layer',
  },
  {
    title: 'Severity normalization',
    description: 'Merge duplicate signals, normalize severity, and surface what is public, exploitable, production blocking, or safe to queue later.',
    icon: Gauge,
    meta: 'analysis layer',
  },
  {
    title: 'Evidence-backed guidance',
    description: 'AI summarizes only existing findings, then converts file, endpoint, and reproduction evidence into concrete fix guidance.',
    icon: ShieldCheck,
    meta: 'trust model',
  },
  {
    title: 'Bilingual remediation',
    description: 'Developers can read practical fixes in Bahasa Indonesia or English without turning scanner results into vague training copy.',
    icon: Languages,
    meta: 'developer ux',
  },
  {
    title: 'Opinionated reports',
    description: 'HTML and Markdown reports are shaped around top risks, fix-first ordering, affected assets, and references teams can share.',
    icon: FileCheck,
    meta: 'output layer',
  },
  {
    title: 'CI and PR workflow',
    description: 'CLI output, SARIF, JSON, and PR comments make the scanner useful before a web dashboard or hosted backend exists.',
    icon: GitPullRequest,
    meta: 'integration',
  },
]

export function Features() {
  return (
    <section id="features" className="relative px-6 py-24 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/25 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
              <Activity className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <h2 className="max-w-xl text-4xl font-semibold tracking-normal text-white sm:text-5xl">
              Designed around the five jobs a developer needs from a scanner.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-zinc-400 lg:justify-self-end">
            The page moves away from generic feature cards and toward an explainable product architecture: scan, analyze, guide, output, and integrate.
          </p>
        </div>

        <StaggerContainer className="mt-14 divide-y divide-white/10 border-y border-white/10">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <StaggerItem key={feature.title}>
                <article className="grid gap-5 py-7 sm:grid-cols-[13rem_1fr_auto] sm:items-center">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                    {feature.meta}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-400">{feature.description}</p>
                  </div>
                  <span className="hidden h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.65)] sm:block" />
                </article>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
