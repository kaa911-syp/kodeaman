import { useEffect } from 'react'

export function useReveal(selector = '.block, .hero, .manifesto, .footer2') {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const els = Array.from(document.querySelectorAll<HTMLElement>(selector))
    els.forEach((el) => el.classList.add('reveal'))

    if (reduce) {
      els.forEach((el) => el.classList.add('in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 }
    )
    els.forEach((el) => io.observe(el))

    return () => io.disconnect()
  }, [selector])
}
