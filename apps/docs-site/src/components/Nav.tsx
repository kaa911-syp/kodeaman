import { useCallback, useEffect, useState } from 'react'
import { KawungMark } from './Mark'

const NAV_LINKS = [
  { href: '#evidence', label: 'evidence' },
  { href: '#exhibit', label: 'exhibit' },
  { href: '#index', label: 'scanners' },
  { href: '#install', label: 'install' },
  { href: 'https://github.com/kaa911-syp/AspidaSec', label: 'docs', external: true },
]

function getInitialTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light'
  return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light'
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)

  const onToggleMode = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('aspida-theme', next)
    } catch {}
    setTheme(next)
  }, [theme])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1001) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#top" className="brand" aria-label="AspidaSec home">
          <KawungMark size={28} />
          <span className="word">
            ASPIDA<span className="dim">·SEC</span>
          </span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-spacer" />
        <div className="nav-meta">
          <span>v0.4.2 · 3d</span>
        </div>
        <button
          type="button"
          className="mode-toggle"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={onToggleMode}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M11.5 9.5A4 4 0 0 1 6.5 4.5a.5.5 0 0 0-.7-.6 5.5 5.5 0 1 0 6.3 6.3.5.5 0 0 0-.6-.7Z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="3.2" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <line x1="8" y1="0.8" x2="8" y2="2.4" />
                <line x1="8" y1="13.6" x2="8" y2="15.2" />
                <line x1="0.8" y1="8" x2="2.4" y2="8" />
                <line x1="13.6" y1="8" x2="15.2" y2="8" />
                <line x1="2.7" y1="2.7" x2="3.8" y2="3.8" />
                <line x1="12.2" y1="12.2" x2="13.3" y2="13.3" />
                <line x1="2.7" y1="13.3" x2="3.8" y2="12.2" />
                <line x1="12.2" y1="3.8" x2="13.3" y2="2.7" />
              </g>
            </svg>
          )}
        </button>
        <a
          className="nav-cta"
          href="https://github.com/kaa911-syp/AspidaSec"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <button
          type="button"
          className="nav-burger"
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          )}
        </button>
      </div>
      <div id="mobile-menu" className={`mobile-menu ${open ? 'open' : ''}`}>
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
      </div>
    </header>
  )
}
