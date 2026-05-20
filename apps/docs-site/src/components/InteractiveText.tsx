import { useRef } from 'react'
import TextCursorProximity from '@/components/ui/text-cursor-proximity'

export function InteractiveText() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div
          className="relative min-h-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#030607]"
          ref={containerRef}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(52,211,153,0.14),transparent_34%),radial-gradient(circle_at_78%_72%,rgba(56,189,248,0.12),transparent_38%)]" />
          <div className="relative flex min-h-[360px] flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
            <TextCursorProximity
              label="SCAN"
              className="text-6xl font-semibold leading-none tracking-normal text-white will-change-transform sm:text-7xl md:text-8xl lg:text-9xl"
              styles={{
                transform: {
                  from: 'scale(1)',
                  to: 'scale(1.12)',
                },
                color: {
                  from: '#FFFFFF',
                  to: '#86EFAC',
                },
              }}
              falloff="gaussian"
              radius={150}
              containerRef={containerRef}
            />
            <TextCursorProximity
              label="RANK"
              className="text-6xl font-semibold leading-none tracking-normal text-zinc-500 will-change-transform sm:text-7xl md:text-8xl lg:text-9xl"
              styles={{
                transform: {
                  from: 'scale(1)',
                  to: 'scale(1.12)',
                },
                color: {
                  from: '#71717A',
                  to: '#38BDF8',
                },
              }}
              falloff="gaussian"
              radius={150}
              containerRef={containerRef}
            />
            <TextCursorProximity
              label="FIX"
              className="text-6xl font-semibold leading-none tracking-normal text-zinc-700 will-change-transform sm:text-7xl md:text-8xl lg:text-9xl"
              styles={{
                transform: {
                  from: 'scale(1)',
                  to: 'scale(1.12)',
                },
                color: {
                  from: '#3F3F46',
                  to: '#FDE68A',
                },
              }}
              falloff="gaussian"
              radius={150}
              containerRef={containerRef}
            />
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:left-10 sm:right-10 md:flex-row md:items-end md:justify-between">
            <p className="max-w-lg text-sm leading-6 text-zinc-400">
              The product should feel like a disciplined security workflow: fewer findings, clearer evidence, and output that moves directly into code review.
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-200">Fix first, explain always</p>
          </div>
        </div>
      </div>
    </section>
  )
}
