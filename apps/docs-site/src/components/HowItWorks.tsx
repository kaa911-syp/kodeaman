import { motion } from 'framer-motion'
import { ArrowDownToLine, Boxes, Code2, FileOutput, ScanLine, Wrench } from 'lucide-react'
import { ScrollReveal } from './animations'

const steps = [
  { title: 'Input', description: 'GitHub repo, local project, or deployed URL.', icon: ArrowDownToLine },
  { title: 'Scan', description: 'Dependency audit, OWASP checks, dynamic scan, and secrets/config review.', icon: ScanLine },
  { title: 'Results', description: 'Severity, evidence, affected endpoint or file, and reproduction context.', icon: Boxes },
  { title: 'Fix', description: 'Practical remediation with safe code examples and references.', icon: Wrench },
  { title: 'Export', description: 'HTML report, Markdown report, PR comment, CI result, or JSON.', icon: FileOutput },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-24 lg:px-8">
      <div className="absolute inset-x-0 top-1/2 -z-10 h-80 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.08),transparent_62%)]" />
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="max-w-3xl">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/10 text-sky-200">
            <Code2 className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <h2 className="text-4xl font-semibold tracking-normal text-white sm:text-5xl">
            The golden path stays one command deep.
          </h2>
          <p className="mt-5 text-base leading-8 text-zinc-400">
            A developer should move from target input to evidence-backed remediation without needing a dashboard, account system, or security team translation layer.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-5">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.article
                key={step.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="absolute right-4 top-4 text-5xl font-semibold text-white/[0.035]">{String(index + 1).padStart(2, '0')}</div>
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/28 text-emerald-200">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="relative mt-8 text-2xl font-semibold text-white">{step.title}</h3>
                <p className="relative mt-3 text-sm leading-7 text-zinc-400">{step.description}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
