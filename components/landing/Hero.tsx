'use client'

import { ScrambleLetter } from '@/components/landing/ScrambleLetter'

// Corner bracket — tight around the content block
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

// ── Headline ──────────────────────────────────────────────────────────────────
// "DESKTOP." (last word) gets the blue accent starting at char index 32.
const HEADLINE      = 'INTELLIGENCE THAT LIVES ON YOUR DESKTOP.'
const DESKTOP_START = 32  // index of 'D' in 'DESKTOP.'

// Pre-compute each word with its global character offset so we can colour
// "DESKTOP." blue without per-character conditional string math at render time.
const HEADLINE_WORDS: { word: string; globalStart: number }[] = []
let _offset = 0
for (const word of HEADLINE.split(' ')) {
  HEADLINE_WORDS.push({ word, globalStart: _offset })
  _offset += word.length + 1  // +1 for the trailing space
}

const EYEBROW_TEXT  = 'AI DESKTOP ASSISTANT'
const SUBTEXT       = 'Zooey understands your world, adapts to your workflow, and gets things done while you focus on what matters.'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Render a string as individual ScrambleLetters, grouping each word in a
 *  `white-space: nowrap` span so the browser never breaks mid-word.           */
function ScrambleText({
  text,
  getStyle,
}: {
  text: string
  getStyle?: (globalIdx: number) => React.CSSProperties
}) {
  const words = text.split(' ')
  let gIdx = 0
  return (
    <>
      {words.map((word, wi) => {
        const wordStart = gIdx
        gIdx += word.length + 1
        return (
          <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {wi > 0 && (
              <span style={{ display: 'inline-block', width: '0.35em' }}>&nbsp;</span>
            )}
            {word.split('').map((char, ci) => (
              <ScrambleLetter
                key={ci}
                char={char}
                style={getStyle ? getStyle(wordStart + ci) : undefined}
              />
            ))}
          </span>
        )
      })}
    </>
  )
}

export default function Hero() {
  return (
    <div
      className="relative flex flex-col items-center text-center animate-fade-up px-12 py-8"
      style={{ animationDelay: '300ms' }}
    >
      <Bracket pos="tl" />
      <Bracket pos="tr" />
      <Bracket pos="bl" />
      <Bracket pos="br" />

      {/* Eyebrow */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="h-px w-5"
          style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15))' }}
        />
        <span
          className="font-mono text-[9px] tracking-[0.26em] uppercase select-none"
          style={{ color: 'rgba(255,255,255,0.22)' }}
        >
          <ScrambleText text={EYEBROW_TEXT} />
        </span>
        <div
          className="h-px w-5"
          style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.15))' }}
        />
      </div>

      {/* Headline — per-word nowrap groups, per-letter scramble */}
      <h1
        className="font-display font-bold uppercase text-center max-w-[680px] mb-5 select-none"
        style={{
          fontSize: 'clamp(22px, 3.2vw, 46px)',
          lineHeight: 1.08,
          letterSpacing: '-0.01em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {HEADLINE_WORDS.map(({ word, globalStart }, wi) => (
          <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {wi > 0 && (
              <span style={{ display: 'inline-block', width: '0.35em' }}>&nbsp;</span>
            )}
            {word.split('').map((char, ci) => {
              const idx = globalStart + ci
              return (
                <ScrambleLetter
                  key={ci}
                  char={char}
                  style={
                    idx >= DESKTOP_START
                      ? { color: '#4a9eff', textShadow: '0 0 18px rgba(74,158,255,0.3)' }
                      : { color: '#f2f2f2' }
                  }
                />
              )
            })}
          </span>
        ))}
      </h1>

      {/* Subtext */}
      <p
        className="font-mono text-center max-w-[380px] mb-9 leading-[1.9] tracking-[0.02em] select-none"
        style={{ fontSize: 'clamp(10px, 0.95vw, 12px)', color: 'rgba(255,255,255,0.28)' }}
      >
        <ScrambleText text={SUBTEXT} />
      </p>

      {/* CTAs */}
      <div className="flex items-center gap-4">
        <button className="btn-primary">DOWNLOAD ZOOEY &nbsp;→</button>
        <button className="btn-secondary">
          <span className="btn-arrow">▶</span>
          WATCH INTERFACE
        </button>
      </div>
    </div>
  )
}
