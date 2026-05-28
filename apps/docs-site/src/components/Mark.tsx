import { useId } from 'react'

interface MarkProps {
  size?: number
  color?: string
  corner?: boolean
}

const SHIELD = 'M16 2 L28 6 V15 C28 23 22.5 28.5 16 31 C9.5 28.5 4 23 4 15 V6 Z'
const CHECK = 'M10.5 16.2 L14.5 20 L21.8 11.5'

export function KawungMark({ size = 36, color }: MarkProps) {
  const id = useId()
  const fill = color || `url(#${id})`
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className="kmark" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="4" y1="2" x2="28" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2DD4BF" />
          <stop offset="1" stopColor="#0F766E" />
        </linearGradient>
      </defs>
      <path d={SHIELD} fill={fill} />
      <path d={CHECK} stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function KawungSeal({ size = 220, color }: Pick<MarkProps, 'size' | 'color'>) {
  const id = useId()
  const fill = color || `url(#${id})`
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className="kseal" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="4" y1="2" x2="28" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2DD4BF" />
          <stop offset="1" stopColor="#0F766E" />
        </linearGradient>
      </defs>
      <path d={SHIELD} fill={fill} fillOpacity="0.12" />
      <path d={SHIELD} fill="none" stroke={color || `url(#${id})`} strokeWidth="1.1" />
      <path d={CHECK} stroke={color || '#2DD4BF'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function KawungGlyph({ size = 18, color }: Pick<MarkProps, 'size' | 'color'>) {
  const id = useId()
  const fill = color || `url(#${id})`
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="4" y1="2" x2="28" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2DD4BF" />
          <stop offset="1" stopColor="#0F766E" />
        </linearGradient>
      </defs>
      <path d={SHIELD} fill={fill} />
      <path d={CHECK} stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
