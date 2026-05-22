'use client'

import { useState, useRef, useCallback } from 'react'

const CHARS = '!@#$%^&*?<>{}[]|/~`+=_-;:,.¥§€©°±'

export function useGlitchText(original: string) {
  const [text, setText] = useState(original)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const frame = useRef(0)
  const FRAMES = 20

  const start = useCallback(() => {
    if (timer.current) clearInterval(timer.current)
    frame.current = 0
    // Immediate full scramble on enter
    setText(
      original.split('').map(ch =>
        ch === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join('')
    )
    timer.current = setInterval(() => {
      frame.current++
      const progress = frame.current / FRAMES
      setText(
        original.split('').map((ch, i) => {
          if (ch === ' ') return ' '
          // Each character has a staggered reveal threshold
          const revealAt = (i / Math.max(1, original.length - 1)) * 0.65 + 0.18
          if (progress >= revealAt) return ch
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
      )
      if (frame.current >= FRAMES) {
        clearInterval(timer.current!)
        timer.current = null
        setText(original)
      }
    }, 38)
  }, [original])

  const stop = useCallback(() => {
    if (timer.current) { clearInterval(timer.current); timer.current = null }
    setText(original)
  }, [original])

  return { text, start, stop }
}
