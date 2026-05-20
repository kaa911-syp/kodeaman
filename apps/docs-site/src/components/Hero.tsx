import { SplineScene } from '@/components/ui/splite'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, CheckCircle, FileText, GitBranch, Radar, ShieldAlert, Terminal } from 'lucide-react'
import { useRef } from 'react'

const scanSignals = ['crawl: 42 routes', 'headers: hardened', 'deps: 3 alerts', 'secrets: clean']

const priorityFindings = [
  { severity: 'Critical', title: 'Auth bypass candidate', target: '/api/session' },
  { severity: 'High', title: 'Stored XSS evidence', target: '/comments' },
  { severity: 'Medium', title: 'Outdated transitive dependency', target: 'vite' },
]

function HeroSplineBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#030607]">
      <div className="absolute inset-0 scale-[1.04] opacity-70 saturate-[1.15] lg:opacity-95">
        <SplineScene
          scene="https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode"
          className="h-full w-full"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#030607_0%,rgba(3,6,7,0.78)_26%,rgba(3,6,7,0.2)_55%,#030607_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,7,0.24)_0%,rgba(3,6,7,0.08)_42%,#030607_94%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#030607] via-[#030607]/88 to-transparent" />
    </div>
  )
}

function ScanConsole() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotateX: 6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.22, ease: 'easeOut' }}
      className="relative mx-auto hidden w-full min-w-0 max-w-full sm:max-w-xl md:block"
    >
      <div className="absolute -inset-6 bg-[radial-gradient(circle_at_50%_25%,rgba(52,211,153,0.18),transparent_58%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#061010]/82 shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <Terminal className="h-4 w-4 text-emerald-300" />
            aspidasec scan
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" />
          </div>
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="rounded-xl border border-emerald-300/15 bg-black/34 p-4 font-mono text-[12px] leading-6 text-zinc-300 sm:text-[13px]">
            <p className="break-all"><span className="text-emerald-300">$</span> aspidasec scan https://app.example.com</p>
            <p className="text-zinc-500">running zap, semgrep, npm audit, secret review...</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {scanSignals.map((signal) => (
              <div key={signal} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-medium text-zinc-300">
                <Radar className="h-3.5 w-3.5 text-emerald-300" />
                {signal}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white">Fix first queue</p>
              <span className="rounded-full border border-emerald-300/20 px-2.5 py-1 text-xs text-emerald-200">evidence locked</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/24 p-3 text-sm leading-6 text-zinc-300 sm:hidden">
              3 prioritized findings ready for report export.
            </div>
            <div className="hidden space-y-3 sm:block">
              {priorityFindings.map((finding) => (
                <div key={finding.title} className="grid grid-cols-[auto_1fr] gap-3 rounded-xl border border-white/10 bg-black/24 p-3">
                  <ShieldAlert className={`mt-0.5 h-4 w-4 ${finding.severity === 'Critical' ? 'text-red-300' : finding.severity === 'High' ? 'text-amber-300' : 'text-sky-300'}`} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">{finding.severity}</span>
                      <span className="text-sm font-semibold text-zinc-100">{finding.title}</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">{finding.target} includes reproduction evidence and remediation notes.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const contentOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0.24])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -44])

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-[92svh] overflow-hidden px-6 pt-28 lg:px-8 lg:pt-32">
      <HeroSplineBackground />
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto grid min-h-[calc(92svh-7rem)] max-w-7xl min-w-0 items-center gap-12 pb-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.78fr)]"
      >
        <div className="min-w-0 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78, ease: 'easeOut' }}
            className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-normal text-white sm:text-6xl sm:leading-[0.98] lg:text-7xl"
          >
            Website security scanning with practical remediation guidance.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78, delay: 0.12, ease: 'easeOut' }}
            className="mt-7 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg"
          >
            AspidaSec helps developers scan modern web applications for OWASP-related risks, prioritize the issues that can actually hurt production, and ship fixes with clear Bahasa Indonesia or English guidance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.2, ease: 'easeOut' }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <a href="#get-started" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-black shadow-[0_0_40px_rgba(52,211,153,0.24)] transition hover:bg-emerald-200">
              Run your first scan
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="https://github.com/kaa911-syp/AspidaSec" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.035] px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-emerald-300/35 hover:bg-white/[0.07]">
              <GitBranch className="h-4 w-4" />
              View GitHub
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.3, ease: 'easeOut' }}
            className="mt-9 grid max-w-2xl gap-3 text-sm text-zinc-400 sm:grid-cols-3"
          >
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-300" />AI never invents findings</div>
            <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-emerald-300" />Reports for teams</div>
            <div className="flex items-center gap-2"><Terminal className="h-4 w-4 text-emerald-300" />CLI-first workflow</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.36, ease: 'easeOut' }}
            className="mt-7 rounded-2xl border border-emerald-300/16 bg-[#061010]/76 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur md:hidden"
          >
            <div className="font-mono text-[12px] leading-6 text-zinc-300">
              <span className="text-emerald-300">$</span> aspidasec scan .
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-sm text-zinc-300">
              <span>3 risks grouped by fix-first priority</span>
              <span className="shrink-0 rounded-full border border-emerald-300/20 px-2.5 py-1 text-xs text-emerald-200">report ready</span>
            </div>
          </motion.div>
        </div>

        <ScanConsole />
      </motion.div>
    </section>
  )
}
