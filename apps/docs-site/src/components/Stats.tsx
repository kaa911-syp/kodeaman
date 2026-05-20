import { CountUp, StaggerContainer, StaggerItem } from './animations'

const stats = [
  { value: 5, suffix: '', label: 'Fix-first risks' },
  { value: 0, suffix: '', label: 'Invented findings' },
  { value: 2, suffix: '', label: 'Guidance languages' },
  { value: 5, suffix: 'm', label: 'MVP scan target' },
]

export function Stats() {
  return (
    <section className="border-y border-white/10 bg-[#06100f] px-6 py-20 lg:px-8">
      <StaggerContainer className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <div className="bg-[#06100f] p-8 text-center">
              <div className="text-5xl font-semibold tracking-normal text-white">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">{stat.label}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  )
}
