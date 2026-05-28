import { useEffect, useRef, useState } from 'react'

type Line =
  | { t: 'cmd'; text: string; delay: number; caret?: boolean }
  | { t: 'dim'; text: string; delay: number }
  | { t: 'step'; label: string; ok: string; delay: number }
  | { t: 'rule'; text: string; delay: number }
  | { t: 'find'; sev: string; cls: 'crit' | 'high' | 'med' | 'low'; code: string; name: string; path: string; delay: number }
  | { t: 'wrote'; text: string; meta: string; delay: number }

const LINES: Line[] = [
  { t: 'cmd', text: 'aspidasec scan .', delay: 280 },
  { t: 'dim', text: '  loading config  .aspidasec.yml  →  language: en', delay: 200 },
  { t: 'dim', text: '  preflight       node 20.11 · pnpm 9 · zap ok · semgrep ok', delay: 240 },
  { t: 'step', label: 'I.   dependency audit', ok: '412 pkgs · 7 advisories', delay: 320 },
  { t: 'step', label: 'II.  static analysis (semgrep)', ok: '1,284 files', delay: 340 },
  { t: 'step', label: 'III. secrets & config', ok: '38 matchers', delay: 280 },
  { t: 'step', label: 'IV.  route crawl (playwright)', ok: '64 routes', delay: 320 },
  { t: 'step', label: 'V.   dynamic scan (zap)', ok: 'baseline · 2m 14s', delay: 480 },
  { t: 'step', label: 'VI.  normalize & prioritize', ok: '142 → 19 actionable', delay: 320 },
  { t: 'rule', text: 'Findings · prioritized', delay: 220 },
  { t: 'find', sev: 'CRIT', cls: 'crit', code: 'A03', name: 'SQL injection', path: 'packages/api/src/orders/query.ts:42', delay: 260 },
  { t: 'find', sev: 'CRIT', cls: 'crit', code: 'A07', name: 'Hardcoded JWT secret', path: 'apps/web/.env.production:7', delay: 240 },
  { t: 'find', sev: 'HIGH', cls: 'high', code: 'A05', name: 'CORS allow-origin: *', path: 'apps/web/server.ts:18', delay: 220 },
  { t: 'find', sev: 'HIGH', cls: 'high', code: 'A06', name: 'lodash 4.17.20', path: 'CVE-2021-23337 · upgrade → 4.17.21', delay: 220 },
  { t: 'find', sev: 'MED', cls: 'med', code: 'A02', name: 'missing CSP header', path: '/, /checkout, /account', delay: 200 },
  { t: 'find', sev: 'LOW', cls: 'low', code: 'A04', name: 'weak password policy', path: 'docs/auth.md', delay: 200 },
  { t: 'dim', text: '  … 13 more (run with --all)', delay: 240 },
  { t: 'wrote', text: 'wrote report.html · report.md · report.sarif', meta: '(2m 38s)', delay: 280 },
  { t: 'cmd', text: '', caret: true, delay: 280 },
]

function pad(s: string, n: number) {
  return s.length >= n ? s : s + ' '.repeat(n - s.length)
}

export function Terminal() {
  const [visible, setVisible] = useState(0)
  const [playing, setPlaying] = useState(true)
  const speedRef = useRef(1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setVisible(LINES.length)
      setPlaying(false)
      return
    }
  }, [])

  useEffect(() => {
    if (!playing) return
    if (visible >= LINES.length) {
      timerRef.current = setTimeout(() => setVisible(0), 4200 / speedRef.current)
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    }
    const d = (LINES[visible].delay || 250) / speedRef.current
    timerRef.current = setTimeout(() => setVisible((n) => n + 1), d)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [visible, playing])

  const renderLine = (line: Line, i: number) => {
    switch (line.t) {
      case 'cmd':
        return (
          <span key={i} className="t2line cmd">
            <span className="glyph">›</span>
            {line.text}
            {line.caret && <span className="caret2" />}
          </span>
        )
      case 'dim':
        return (
          <span key={i} className="t2line dim">
            {line.text}
          </span>
        )
      case 'step':
        return (
          <span key={i} className="t2line ok">
            <span className="lbl">{pad(line.label, 36)}</span>
            <span className="check">✓ </span>
            <span className="meta">{line.ok}</span>
          </span>
        )
      case 'rule':
        return (
          <span key={i} className="t2line findings-rule">
            {line.text}
          </span>
        )
      case 'find':
        return (
          <span key={i} className="t2line">
            <span className={`sev ${line.cls}`}>{line.sev}</span>
            <span className="meta">
              {line.code} · {line.name}
            </span>
            <span className="path">   {line.path}</span>
          </span>
        )
      case 'wrote':
        return (
          <span key={i} className="t2line wrote">
            {line.text} <span className="path">  {line.meta}</span>
          </span>
        )
    }
  }

  return (
    <div className="term2" aria-label="AspidaSec scan transcript" role="img">
      <div className="term2-head">
        <span className="pulse">A LIVE TRANSCRIPT</span>
        <span style={{ marginLeft: 'auto' }}>~/checkout-web · 2026·05·27</span>
      </div>
      <div className="term2-body">{LINES.slice(0, visible).map(renderLine)}</div>
      <div className="term2-ctrl">
        <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause transcript' : 'Play transcript'}>
          {playing ? 'pause' : 'play'}
        </button>
        <button
          type="button"
          onClick={() => {
            setVisible(0)
            setPlaying(true)
          }}
          aria-label="Replay transcript"
        >
          replay
        </button>
      </div>
    </div>
  )
}
