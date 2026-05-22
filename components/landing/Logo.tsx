'use client'

import Mascot from './Mascot'
import { useGlitchText } from '@/lib/useGlitchText'

export default function Logo() {
  const { text, start, stop } = useGlitchText('ZOOEY')
  return (
    <div
      className="flex items-center gap-3 cursor-default select-none"
      onMouseEnter={start} onMouseLeave={stop}
    >
      <Mascot size="sm" />
      <span
        className="font-display font-bold uppercase tracking-[0.22em]"
        style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)' }}
      >
        {text}
      </span>
    </div>
  )
}
