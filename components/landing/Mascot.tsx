'use client'

import Image from 'next/image'
import { useState } from 'react'

interface MascotProps {
  size: 'sm' | 'lg'
}

// Geometric placeholder shown while mascot.png is absent
function MascotPlaceholder({ px }: { px: number }) {
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* UFO dish */}
      <ellipse cx="32" cy="42" rx="22" ry="8" fill="#1e3a6e" />
      <ellipse cx="32" cy="40" rx="22" ry="8" fill="#2a5092" />
      {/* Colored lights on rim */}
      <rect x="12" y="37" width="5" height="3" fill="#00e5ff" />
      <rect x="19" y="37" width="5" height="3" fill="#4caf6e" />
      <rect x="26" y="37" width="5" height="3" fill="#ffeb3b" />
      <rect x="33" y="37" width="5" height="3" fill="#ff5722" />
      <rect x="40" y="37" width="5" height="3" fill="#00e5ff" />
      {/* Dome */}
      <ellipse cx="32" cy="36" rx="14" ry="10" fill="#1a2e50" />
      <ellipse cx="32" cy="35" rx="14" ry="10" fill="#0d1f3c" />
      {/* Alien face */}
      <ellipse cx="32" cy="32" rx="10" ry="10" fill="#3a7a48" />
      {/* Eyes */}
      <ellipse cx="27" cy="30" rx="3.5" ry="4" fill="#0a0f1a" />
      <ellipse cx="37" cy="30" rx="3.5" ry="4" fill="#0a0f1a" />
      <ellipse cx="26" cy="29" rx="1.2" ry="1.5" fill="white" />
      <ellipse cx="36" cy="29" rx="1.2" ry="1.5" fill="white" />
      {/* Mouth */}
      <rect x="28" y="35" width="8" height="2.5" rx="1" fill="#c0392b" />
      {/* Antenna */}
      <rect x="31" y="22" width="2" height="6" fill="#2a5092" />
      <circle cx="32" cy="21" r="2.5" fill="#4a90d9" />
      {/* Engine glow */}
      <ellipse cx="32" cy="49" rx="4" ry="2" fill="rgba(255,200,80,0.6)" />
      <ellipse cx="32" cy="51" rx="2" ry="1.5" fill="rgba(255,120,20,0.8)" />
    </svg>
  )
}

export default function Mascot({ size }: MascotProps) {
  const px = size === 'sm' ? 34 : 68
  const [errored, setErrored] = useState(false)

  const filter =
    'drop-shadow(0 0 14px rgba(74,144,217,0.35)) drop-shadow(0 0 5px rgba(74,144,217,0.18))'

  if (errored) {
    return (
      <div style={{ filter }}>
        <MascotPlaceholder px={px} />
      </div>
    )
  }

  return (
    <Image
      src="/mascot.png"
      alt="Zooey mascot"
      width={px}
      height={px}
      className={size === 'lg' ? 'animate-float' : ''}
      style={{ imageRendering: 'pixelated', filter }}
      priority
      onError={() => setErrored(true)}
    />
  )
}
