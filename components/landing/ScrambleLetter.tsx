'use client'

import { useState, useRef, useCallback } from 'react'

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*?'
const FRAMES = 9
const FRAME_MS = 42

export function ScrambleLetter({
  char,
  className,
  style,
}: {
  char: string
  className?: string
  style?: React.CSSProperties
}) {
  const [display, setDisplay] = useState(char)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const frameCount = useRef(0)

  const scramble = useCallback(() => {
    if (char === ' ' || char === '.') return
    frameCount.current = 0
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      frameCount.current++
      if (frameCount.current >= FRAMES) {
        setDisplay(char)
        clearInterval(intervalRef.current!)
        intervalRef.current = null
      } else {
        setDisplay(CHARSET[Math.floor(Math.random() * CHARSET.length)])
      }
    }, FRAME_MS)
  }, [char])

  // Fixed-width space — never scrambled
  if (char === ' ') {
    return <span style={{ display: 'inline-block', width: '0.35em' }}>&nbsp;</span>
  }

  return (
    <span
      className={className}
      style={{ display: 'inline-block', cursor: 'default', ...style }}
      onMouseEnter={scramble}
    >
      {display}
    </span>
  )
}
