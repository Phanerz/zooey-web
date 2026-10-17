'use client'

import { MagneticHeadline } from '@/components/landing/MagneticHeadline'

// ── Corner brackets ───────────────────────────────────────────────────────────
function Bracket({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const top  = pos === 'tl' || pos === 'tr'
  const left = pos === 'tl' || pos === 'bl'
  return (
    <div
      className="absolute w-4 h-4 pointer-events-none"
      style={{
        top:    top    ? 0 : undefined,
        bottom: !top   ? 0 : undefined,
        left:   left   ? 0 : undefined,
        right:  !left  ? 0 : undefined,
        borderTop:    top    ? '1px solid rgba(255,255,255,0.18)' : undefined,
        borderBottom: !top   ? '1px solid rgba(255,255,255,0.18)' : undefined,
        borderLeft:   left   ? '1px solid rgba(255,255,255,0.18)' : undefined,
        borderRight:  !left  ? '1px solid rgba(255,255,255,0.18)' : undefined,
      }}
    />
  )
}

export default function Hero() {
  return (
    <div
      className="relative flex flex-col items-center text-center px-12 py-8"
    >
      <Bracket pos="tl" />
      <Bracket pos="tr" />
      <Bracket pos="bl" />
      <Bracket pos="br" />

      {/* Eyebrow */}
      <div
        className="flex items-center gap-3 mb-5 animate-fade-up"
        style={{ animationDelay: '200ms' }}
      >
        <div className="h-px w-5"
          style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15))' }}
        />
        <span
          className="font-display text-[9px] tracking-[0.26em] uppercase select-none"
          style={{ color: 'rgba(255,255,255,0.22)' }}
        >
          AI DESKTOP ASSISTANT
        </span>
        <div className="h-px w-5"
          style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.15))' }}
        />
      </div>

      {/* Headline */}
      <MagneticHeadline />

      {/* Subtext */}
      <p
        className="font-mono text-center max-w-[400px] mb-9 leading-[1.9] tracking-[0.03em] select-none animate-fade-up"
        style={{
          fontSize: 'clamp(9px, 0.88vw, 11px)',
          color: 'rgba(255,255,255,0.26)',
          textTransform: 'uppercase',
          animationDelay: '600ms',
        }}
      >
        ZOOEY UNDERSTANDS YOUR WORLD, ADAPTS TO YOUR WORKFLOW, AND GETS THINGS DONE WHILE YOU FOCUS ON WHAT MATTERS.
      </p>

      {/* CTAs */}
      <div className="flex items-center gap-4 animate-fade-up" style={{ animationDelay: '900ms' }}>
        <a href="/download/mac" className="btn-primary">DOWNLOAD ZOOEY &nbsp;→</a>
        <button className="btn-secondary">
          <span className="btn-arrow">▶</span>
          WATCH INTERFACE
        </button>
      </div>
    </div>
  )
}
