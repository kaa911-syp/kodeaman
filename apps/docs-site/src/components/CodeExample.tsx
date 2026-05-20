import { AnimatePresence, motion } from 'framer-motion'
import { Boxes, ServerCog, Terminal } from 'lucide-react'
import { useState } from 'react'
import { ScrollReveal } from './animations'

const snippets = {
  CLI: {
    icon: Terminal,
    code: `git clone https://github.com/kaa911-syp/AspidaSec.git
cd AspidaSec
pnpm install && pnpm run build
pnpm --filter @aspidasec/cli start -- scan ./my-project`,
  },
  MCP: {
    icon: ServerCog,
    code: `{
  "mcpServers": {
    "aspidasec": {
      "command": "pnpm",
      "args": ["--filter", "@aspidasec/mcp-server", "start"]
    }
  }
}`,
  },
  Docker: {
    icon: Boxes,
    code: `git clone https://github.com/kaa911-syp/AspidaSec.git
cd AspidaSec
docker compose up --build
pnpm --filter @aspidasec/cli start -- scan ./my-project`,
  },
}

type Tab = keyof typeof snippets

export function CodeExample() {
  const [activeTab, setActiveTab] = useState<Tab>('CLI')
  const ActiveIcon = snippets[activeTab].icon

  return (
    <section id="get-started" className="relative px-6 py-24 lg:px-8">
      <div className="absolute inset-x-0 bottom-0 h-96 bg-[radial-gradient(circle_at_50%_100%,rgba(52,211,153,0.1),transparent_62%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
        <ScrollReveal>
          <h2 className="max-w-xl text-4xl font-semibold tracking-normal text-white sm:text-5xl">
            Start from the terminal, then wire it into CI.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-zinc-400">
            CLI-first keeps the MVP honest. The scanner should run locally, in automation, and inside assistant workflows before the product grows a hosted dashboard.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#06100f] shadow-[0_28px_100px_rgba(0,0,0,0.36)]">
            <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.035] p-3 sm:flex-row">
              {(Object.keys(snippets) as Tab[]).map((tab) => {
                const Icon = snippets[tab].icon
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${activeTab === tab ? 'bg-emerald-300 text-black' : 'text-zinc-400 hover:bg-white/[0.06] hover:text-white'}`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab}
                  </button>
                )
              })}
            </div>
            <div className="relative min-h-80 p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                <ActiveIcon className="h-4 w-4" />
                runnable setup
              </div>
              <AnimatePresence mode="wait">
                <motion.pre
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/34 p-4 font-mono text-[13px] leading-7 text-zinc-200 sm:text-sm"
                >
                  <code>{snippets[activeTab].code}</code>
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
