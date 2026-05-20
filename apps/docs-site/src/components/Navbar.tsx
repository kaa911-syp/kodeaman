import { Menu, ShieldCheck, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const links = [
  { label: 'Scanner', href: '#features' },
  { label: 'Workflow', href: '#how-it-works' },
  { label: 'Reports', href: '#report-preview' },
  { label: 'CLI', href: '#get-started' },
  { label: 'GitHub', href: 'https://github.com/kaa911-syp/AspidaSec' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', closeOnResize)
    return () => window.removeEventListener('resize', closeOnResize)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <nav className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-[#061010]/72 px-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:px-5">
        <div className="flex h-16 items-center justify-between">
          <a href="#hero" className="flex items-center gap-3 text-sm font-semibold tracking-tight text-[#f7fbfa]" onClick={() => setIsOpen(false)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/25 bg-emerald-300/10 text-emerald-200 shadow-[0_0_40px_rgba(52,211,153,0.18)]">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <span className="text-lg">AspidaSec</span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-zinc-400 transition hover:text-[#f7fbfa]">
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#get-started"
            className="hidden items-center justify-center rounded-xl border border-emerald-300/30 bg-emerald-300 px-4 py-2 text-sm font-semibold text-black shadow-[0_0_32px_rgba(52,211,153,0.24)] transition hover:bg-emerald-200 md:inline-flex"
          >
            Run scan
          </a>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-200 transition hover:border-emerald-300/35 hover:text-white md:hidden"
            onClick={() => setIsOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className={`grid transition-all duration-300 md:hidden ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="space-y-2 border-t border-white/10 pb-4 pt-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#get-started"
                className="mt-3 flex items-center justify-center rounded-xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-black"
                onClick={() => setIsOpen(false)}
              >
                Run scan
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
