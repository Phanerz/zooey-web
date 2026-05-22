'use client'

import { useState } from 'react'
import Mascot from './Mascot'

// ── Geometry ─────────────────────────────────────────────────────────────────
// Center: (280, 310) — bottom edge of the 560×310 viewBox
// Radius: 260
// Perfect 180° semicircle split into 5 equal 36° segments
//
// Boundary points (angle measured CCW from +x, SVG y-down):
//   x = 280 + 260·cos(θ),  y = 310 − 260·sin(θ)
//
//  θ=180° → (20,  310)
//  θ=144° → (70,  157)
//  θ=108° → (200,  63)
//  θ= 72° → (360,  63)
//  θ= 36° → (490, 157)
//  θ=  0° → (540, 310)
//
// Arc command: sweep-flag=0 (CCW) goes over the top — correct for upper semicircle

interface Segment {
  id: string; label: string
  path: string        // SVG path — pie slice
  labelX: number; labelY: number
  iconX:  number; iconY:  number
  gradId: string
  colorDark: string; colorMid: string; colorEdge: string
  strokeHover: string
}

const segments: Segment[] = [
  {
    id: 'nodes',  label: 'NODES',
    path: 'M280,310 L20,310 A260,260,0,0,0,70,157 Z',
    labelX: 132, labelY: 264,  iconX: 97,  iconY: 251,
    gradId: 'rg-nodes',
    colorDark:  'rgba(2,20,20,0.96)',
    colorMid:   'rgba(6,72,65,0.92)',
    colorEdge:  'rgba(0,158,138,0.90)',
    strokeHover: 'rgba(0,200,175,0.65)',
  },
  {
    id: 'integrations', label: 'INTEGRATIONS',
    path: 'M280,310 L70,157 A260,260,0,0,0,200,63 Z',
    labelX: 188, labelY: 186,  iconX: 167, iconY: 155,
    gradId: 'rg-integrations',
    colorDark:  'rgba(2,16,6,0.96)',
    colorMid:   'rgba(8,68,26,0.92)',
    colorEdge:  'rgba(28,158,55,0.90)',
    strokeHover: 'rgba(38,200,72,0.65)',
  },
  {
    id: 'pricing', label: 'PRICING',
    path: 'M280,310 L200,63 A260,260,0,0,0,360,63 Z',
    labelX: 280, labelY: 156,  iconX: 280, iconY: 120,
    gradId: 'rg-pricing',
    colorDark:  'rgba(18,13,2,0.96)',
    colorMid:   'rgba(88,55,5,0.92)',
    colorEdge:  'rgba(198,128,8,0.90)',
    strokeHover: 'rgba(240,162,18,0.65)',
  },
  {
    id: 'docs', label: 'DOCS',
    path: 'M280,310 L360,63 A260,260,0,0,0,490,157 Z',
    labelX: 372, labelY: 186,  iconX: 393, iconY: 155,
    gradId: 'rg-docs',
    colorDark:  'rgba(18,7,3,0.96)',
    colorMid:   'rgba(78,25,10,0.92)',
    colorEdge:  'rgba(178,56,18,0.90)',
    strokeHover: 'rgba(220,75,28,0.65)',
  },
  {
    id: 'about', label: 'ABOUT',
    path: 'M280,310 L490,157 A260,260,0,0,0,540,310 Z',
    labelX: 428, labelY: 264,  iconX: 463, iconY: 251,
    gradId: 'rg-about',
    colorDark:  'rgba(13,3,22,0.96)',
    colorMid:   'rgba(58,14,96,0.92)',
    colorEdge:  'rgba(138,38,218,0.90)',
    strokeHover: 'rgba(168,58,252,0.65)',
  },
]

// Spokes from center to each boundary (excluding the two bottom-edge endpoints)
const spokes = [
  { x: 70,  y: 157 },
  { x: 200, y:  63 },
  { x: 280, y:  50 },  // top midpoint (midpoint of PRICING at 90°)
  { x: 360, y:  63 },
  { x: 490, y: 157 },
]

// ── Icons ─────────────────────────────────────────────────────────────────────
function NodeIcon({ cx, cy, active }: { cx: number; cy: number; active: boolean }) {
  const c = active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.48)'
  return (
    <g>
      <line x1={cx-8} y1={cy} x2={cx+8} y2={cy} stroke={c} strokeWidth="1.4"/>
      <line x1={cx} y1={cy-8} x2={cx} y2={cy+8} stroke={c} strokeWidth="1.4"/>
      <circle cx={cx}   cy={cy}   r="2.2" fill={c}/>
      <circle cx={cx-8} cy={cy}   r="1.5" fill={c}/>
      <circle cx={cx+8} cy={cy}   r="1.5" fill={c}/>
      <circle cx={cx}   cy={cy-8} r="1.5" fill={c}/>
      <circle cx={cx}   cy={cy+8} r="1.5" fill={c}/>
    </g>
  )
}

function GridIcon({ cx, cy, active }: { cx: number; cy: number; active: boolean }) {
  const c = active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.48)'
  return (
    <g>
      <rect x={cx-8}   y={cy-8}   width={6.5} height={6.5} rx={0.7} fill="none" stroke={c} strokeWidth="1.2"/>
      <rect x={cx+1.5} y={cy-8}   width={6.5} height={6.5} rx={0.7} fill="none" stroke={c} strokeWidth="1.2"/>
      <rect x={cx-8}   y={cy+1.5} width={6.5} height={6.5} rx={0.7} fill="none" stroke={c} strokeWidth="1.2"/>
      <rect x={cx+1.5} y={cy+1.5} width={6.5} height={6.5} rx={0.7} fill="none" stroke={c} strokeWidth="1.2"/>
    </g>
  )
}

function HexIcon({ cx, cy, active }: { cx: number; cy: number; active: boolean }) {
  const c = active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.48)'
  // Use rational constants — avoids Node.js vs browser trig float divergence.
  // cos(60°)=0.5 is exact in IEEE 754 → dx=4 is exact.
  // sin(60°)=√3/2 → dy hardcoded to 3 dp (6.928) — identical string in all JS engines.
  const dy  = 6.928
  const pts = `${cx+8},${cy} ${cx+4},${cy+dy} ${cx-4},${cy+dy} ${cx-8},${cy} ${cx-4},${cy-dy} ${cx+4},${cy-dy}`
  return (
    <g>
      <polygon points={pts} fill="none" stroke={c} strokeWidth="1.4"/>
      <circle cx={cx} cy={cy} r="2" fill={c}/>
    </g>
  )
}

function DocIcon({ cx, cy, active }: { cx: number; cy: number; active: boolean }) {
  const c = active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.48)'
  return (
    <g>
      <rect x={cx-6} y={cy-8} width={12} height={15} rx={0.8} fill="none" stroke={c} strokeWidth="1.3"/>
      <line x1={cx-3.5} y1={cy-2.5} x2={cx+3.5} y2={cy-2.5} stroke={c} strokeWidth="1.1"/>
      <line x1={cx-3.5} y1={cy+0.8} x2={cx+3.5} y2={cy+0.8} stroke={c} strokeWidth="1.1"/>
      <line x1={cx-3.5} y1={cy+4.0} x2={cx+1}   y2={cy+4.0} stroke={c} strokeWidth="1.1"/>
    </g>
  )
}

function PersonIcon({ cx, cy, active }: { cx: number; cy: number; active: boolean }) {
  const c = active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.48)'
  return (
    <g>
      <circle cx={cx} cy={cy-5} r="3.5" fill="none" stroke={c} strokeWidth="1.3"/>
      <path d={`M${cx-7},${cy+8} Q${cx-5.5},${cy+1} ${cx},${cy+1} Q${cx+5.5},${cy+1} ${cx+7},${cy+8}`}
        fill="none" stroke={c} strokeWidth="1.3"/>
    </g>
  )
}

const ICONS = [NodeIcon, GridIcon, HexIcon, DocIcon, PersonIcon]

export default function RadialNav() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20"
      style={{ width: 560, height: 310 }}
    >
      <div
        className="animate-fade-up w-full h-full relative"
        style={{ animationDelay: '500ms' }}
      >
        <svg viewBox="0 0 560 310" width={560} height={310} style={{ overflow: 'visible' }}>
          <defs>
            {segments.map(seg => (
              <radialGradient
                key={seg.gradId} id={seg.gradId}
                cx="280" cy="310" r="260" gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%"   stopColor={seg.colorDark}/>
                <stop offset="38%"  stopColor={seg.colorMid}/>
                <stop offset="100%" stopColor={seg.colorEdge}/>
              </radialGradient>
            ))}
          </defs>

          {/* Decorative half-arcs */}
          <path d="M20,310 A260,162,0,0,0,540,310"
            stroke="rgba(255,255,255,0.05)" fill="none" strokeWidth={0.7}/>
          <path d="M50,310 A230,143,0,0,0,510,310"
            stroke="rgba(255,255,255,0.065)" fill="none" strokeWidth={0.5}/>

          {/* Bottom baseline */}
          <line x1={20} y1={310} x2={540} y2={310}
            stroke="rgba(255,255,255,0.06)" strokeWidth={0.6}/>

          {/* Spoke dividers */}
          {spokes.map((s, i) => (
            <line key={i} x1={280} y1={310} x2={s.x} y2={s.y}
              stroke="rgba(255,255,255,0.07)" strokeWidth={0.6}/>
          ))}

          {/* Segments */}
          {segments.map((seg, idx) => {
            const isActive = hovered === seg.id
            const Icon = ICONS[idx]
            return (
              <g key={seg.id}>
                <path
                  d={seg.path}
                  fill={`url(#${seg.gradId})`}
                  stroke={isActive ? seg.strokeHover : 'rgba(255,255,255,0.08)'}
                  strokeWidth={0.9}
                  style={{
                    cursor: 'pointer',
                    transition: 'stroke 0.22s ease, filter 0.22s ease',
                    filter: isActive
                      ? `brightness(1.38) drop-shadow(0 0 12px ${seg.strokeHover})`
                      : 'brightness(0.70)',
                  }}
                  onMouseEnter={() => setHovered(seg.id)}
                  onMouseLeave={() => setHovered(null)}
                />
                <Icon cx={seg.iconX} cy={seg.iconY} active={isActive}/>
                <text
                  x={seg.labelX} y={seg.labelY} textAnchor="middle"
                  fill={isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.42)'}
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: '7.8px',
                    letterSpacing: '0.20em',
                    pointerEvents: 'none',
                    transition: 'fill 0.22s ease',
                  }}
                >
                  {seg.label}
                </text>
                <circle
                  cx={seg.labelX} cy={seg.labelY + 10} r={1.2}
                  fill={isActive ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.18)'}
                  style={{ transition: 'fill 0.22s ease' }}
                />
              </g>
            )
          })}

          {/* Center hub */}
          <circle cx={280} cy={310} r={54}
            fill="rgba(4,4,8,0.97)" stroke="rgba(255,255,255,0.10)" strokeWidth={0.8}/>
          <circle cx={280} cy={310} r={40}
            fill="rgba(2,2,5,0.99)" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5}/>
        </svg>

        {/* Mascot */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 26 }}>
          <Mascot size="lg"/>
        </div>
      </div>
    </div>
  )
}
