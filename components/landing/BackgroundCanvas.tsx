'use client'

import { useEffect, useRef } from 'react'

// ── Star types ────────────────────────────────────────────────────────────────

type StarColor = 'white' | 'blue' | 'purple' | 'red'

interface Star {
  x: number
  y: number
  r: number
  baseAlpha: number
  t: number
  speed: number
  color: StarColor
  revealThreshold: number  // 0 = always on; >0 = hover/scroll to reveal
  hoverBrightness: number  // 0–1, decays after cursor leaves
}

interface Shooter {
  x: number; y: number; vx: number; vy: number
  speed: number; life: number; maxLife: number; active: boolean
}

// ── Star color helpers — desaturated, cinematic ───────────────────────────────

function assignStarColor(): StarColor {
  const r = Math.random()
  if (r < 0.70) return 'white'
  if (r < 0.86) return 'blue'
  if (r < 0.96) return 'purple'
  return 'red'
}

const STAR_RGBA: Record<StarColor, (a: number) => string> = {
  white:  (a) => `rgba(212, 220, 228, ${a})`,
  blue:   (a) => `rgba(168, 188, 212, ${a})`,
  purple: (a) => `rgba(192, 178, 212, ${a})`,
  red:    (a) => `rgba(218, 176, 168, ${a})`,
}

const STAR_COUNT = 420

function initStars(W: number, H: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => {
    const alwaysOn = Math.random() < 0.32
    return {
      x: Math.random() * W,
      y: Math.random() * H * 0.74,
      r: Math.random() * 1.55 + 0.22,
      baseAlpha: Math.random() * 0.32 + 0.05,
      t: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.003 + 0.002,
      color: assignStarColor(),
      revealThreshold: alwaysOn ? 0 : Math.random() * 0.65 + 0.35,
      hoverBrightness: 0,
    }
  })
}

// ── Grain tile ────────────────────────────────────────────────────────────────

function buildGrainTile(): HTMLCanvasElement {
  const size = 256
  const gc   = document.createElement('canvas')
  gc.width = gc.height = size
  const gctx = gc.getContext('2d')!
  const id   = gctx.createImageData(size, size)
  for (let i = 0; i < id.data.length; i += 4) {
    const v = Math.floor(Math.random() * 255)
    id.data[i] = id.data[i+1] = id.data[i+2] = v
    id.data[i+3] = 8
  }
  gctx.putImageData(id, 0, 0)
  return gc
}

// ── Constellation types & data ────────────────────────────────────────────────

interface CStar { nx: number; ny: number; r: number }
interface CLine { from: number; to: number }
interface Constellation {
  name: string
  stars: CStar[]
  lines: CLine[]
  labelNX: number
  labelNY: number
  peripheral: CStar[]
}

const CONSTELLATIONS: Constellation[] = [
  {
    // Cancer — top-right corner
    // Y-shape: ι top-left → γ center-top → δ center → branches to α (right) and β (left)
    name: 'CANCER',
    stars: [
      { nx: 0.66, ny: 0.06, r: 1.6 },  // 0  ι Cnc         upper-left arm
      { nx: 0.72, ny: 0.09, r: 1.8 },  // 1  γ Cnc  Asellus Borealis
      { nx: 0.75, ny: 0.16, r: 2.0 },  // 2  δ Cnc  Asellus Australis  center
      { nx: 0.84, ny: 0.21, r: 1.8 },  // 3  α Cnc  Acubens   lower-right
      { nx: 0.68, ny: 0.23, r: 2.2 },  // 4  β Cnc  Tarf      lower-left, brightest
      { nx: 0.81, ny: 0.07, r: 1.2 },  // 5  55 Cnc           upper-right area
    ],
    lines: [
      { from: 0, to: 1 },   // ι → γ
      { from: 1, to: 2 },   // γ → δ
      { from: 2, to: 3 },   // δ → α
      { from: 2, to: 4 },   // δ → β
      { from: 1, to: 5 },   // γ → 55 Cnc
    ],
    labelNX: 0.76, labelNY: 0.32,
    peripheral: [
      { nx: 0.63, ny: 0.04, r: 0.7 },
      { nx: 0.87, ny: 0.05, r: 0.6 },
      { nx: 0.89, ny: 0.17, r: 0.8 },
      { nx: 0.62, ny: 0.20, r: 0.5 },
      { nx: 0.79, ny: 0.27, r: 0.6 },
    ],
  },
  {
    // Libra — center, slightly right & lower
    // Scales shape: β top-center, α lower-left, γ right, σ bottom
    name: 'LIBRA',
    stars: [
      { nx: 0.53, ny: 0.20, r: 2.4 },  // 0  β Lib  Zubeneschamali  top, brightest
      { nx: 0.46, ny: 0.34, r: 2.0 },  // 1  α Lib  Zubenelgenubi   lower-left
      { nx: 0.62, ny: 0.30, r: 1.8 },  // 2  γ Lib  Zubenelhakrabi  right
      { nx: 0.52, ny: 0.42, r: 1.4 },  // 3  σ Lib                  bottom
      { nx: 0.66, ny: 0.38, r: 1.2 },  // 4  θ Lib                  lower-right
      { nx: 0.58, ny: 0.23, r: 1.0 },  // 5  υ Lib                  upper-right
    ],
    lines: [
      { from: 0, to: 1 },   // β → α  left diagonal
      { from: 0, to: 2 },   // β → γ  right diagonal
      { from: 1, to: 3 },   // α → σ  left drop
      { from: 2, to: 3 },   // γ → σ  right drop  (closes the quadrilateral)
      { from: 2, to: 4 },   // γ → θ  right extension
      { from: 0, to: 5 },   // β → υ  top-right notch
    ],
    labelNX: 0.55, labelNY: 0.50,
    peripheral: [
      { nx: 0.42, ny: 0.26, r: 0.6 },
      { nx: 0.60, ny: 0.17, r: 0.7 },
      { nx: 0.44, ny: 0.44, r: 0.5 },
      { nx: 0.68, ny: 0.28, r: 0.6 },
      { nx: 0.48, ny: 0.16, r: 0.8 },
    ],
  },
  {
    // Sagittarius — right side, teapot asterism
    // Spout (γ-δ), lid (δ-λ), body (λ-σ-ζ-ε-δ), handle (σ-τ-φ-ζ)
    name: 'SAGITTARIUS',
    stars: [
      { nx: 0.70, ny: 0.27, r: 1.8 },  // 0  γ Sgr  Alnasl        spout tip
      { nx: 0.74, ny: 0.22, r: 1.8 },  // 1  δ Sgr  Kaus Media    spout base / body-left
      { nx: 0.76, ny: 0.13, r: 2.0 },  // 2  λ Sgr  Kaus Borealis lid
      { nx: 0.80, ny: 0.33, r: 2.4 },  // 3  ε Sgr  Kaus Australis bottom, brightest
      { nx: 0.83, ny: 0.29, r: 1.8 },  // 4  ζ Sgr  Ascella       body right
      { nx: 0.87, ny: 0.15, r: 2.2 },  // 5  σ Sgr  Nunki         handle upper
      { nx: 0.91, ny: 0.22, r: 1.4 },  // 6  τ Sgr               handle mid
      { nx: 0.89, ny: 0.30, r: 1.4 },  // 7  φ Sgr               handle lower
    ],
    lines: [
      { from: 0, to: 1 },   // spout
      { from: 1, to: 2 },   // spout to lid
      { from: 1, to: 3 },   // body left side
      { from: 2, to: 5 },   // lid to handle top
      { from: 3, to: 4 },   // body bottom
      { from: 4, to: 5 },   // body right side
      { from: 5, to: 6 },   // handle upper
      { from: 6, to: 7 },   // handle lower
      { from: 7, to: 4 },   // handle close
    ],
    labelNX: 0.81, labelNY: 0.45,
    peripheral: [
      { nx: 0.68, ny: 0.33, r: 0.7 },
      { nx: 0.73, ny: 0.10, r: 0.6 },
      { nx: 0.85, ny: 0.09, r: 0.8 },
      { nx: 0.93, ny: 0.28, r: 0.5 },
      { nx: 0.85, ny: 0.37, r: 0.6 },
    ],
  },
]

// ── Constellation state ───────────────────────────────────────────────────────

interface CState {
  idx: number
  phase: 'reveal' | 'hold' | 'fade'
  progress: number
  starP: number[]
  lineP: number[]
  periP: number[]
  labelA: number
}

const REVEAL_MS = 2800
const HOLD_MS   = 4200
const FADE_MS   = 1600

function freshCState(idx: number): CState {
  const c = CONSTELLATIONS[idx]
  return {
    idx,
    phase: 'reveal',
    progress: 0,
    starP: new Array(c.stars.length).fill(0),
    lineP: new Array(c.lines.length).fill(0),
    periP: new Array(c.peripheral.length).fill(0),
    labelA: 0,
  }
}

function updateCState(s: CState, dt: number): void {
  const c = CONSTELLATIONS[s.idx]

  if (s.phase === 'reveal') {
    s.progress = Math.min(s.progress + dt / REVEAL_MS, 1)

    c.stars.forEach((_, i) => {
      const thr = (i / c.stars.length) * 0.65
      if (s.progress > thr)
        s.starP[i] = Math.min((s.progress - thr) / 0.30, 1)
    })

    c.lines.forEach((_, i) => {
      const thr = 0.22 + (i / c.lines.length) * 0.58
      if (s.progress > thr)
        s.lineP[i] = Math.min((s.progress - thr) / 0.20, 1)
    })

    c.peripheral.forEach((_, i) => {
      const thr = 0.62 + (i / c.peripheral.length) * 0.32
      if (s.progress > thr)
        s.periP[i] = Math.min((s.progress - thr) / 0.12, 1)
    })

    s.labelA = s.progress > 0.78 ? Math.min((s.progress - 0.78) / 0.22, 1) : 0

    if (s.progress >= 1) { s.phase = 'hold'; s.progress = 0 }
    return
  }

  if (s.phase === 'hold') {
    s.progress = Math.min(s.progress + dt / HOLD_MS, 1)
    if (s.progress >= 1) { s.phase = 'fade'; s.progress = 0 }
    return
  }

  if (s.phase === 'fade') {
    s.progress = Math.min(s.progress + dt / FADE_MS, 1)
    if (s.progress >= 1) {
      const next = (s.idx + 1) % 3
      Object.assign(s, freshCState(next))
    }
  }
}

function drawCState(
  ctx: CanvasRenderingContext2D,
  s: CState,
  W: number,
  H: number
): void {
  const c     = CONSTELLATIONS[s.idx]
  const fade  = s.phase === 'fade' ? 1 - s.progress : 1
  const intro = s.phase === 'reveal' && s.progress < 0.06 ? s.progress / 0.06 : 1
  const gA    = fade * intro   // global alpha multiplier

  // Lines — animate as growing strokes
  c.lines.forEach((ln, i) => {
    const p = s.lineP[i] * gA
    if (p <= 0) return
    const sx = c.stars[ln.from].nx * W, sy = c.stars[ln.from].ny * H
    const ex = c.stars[ln.to].nx   * W, ey = c.stars[ln.to].ny   * H
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.lineTo(sx + (ex - sx) * p, sy + (ey - sy) * p)
    ctx.strokeStyle = `rgba(130, 170, 255, ${0.24 * gA})`
    ctx.lineWidth = 0.65
    ctx.stroke()
    ctx.restore()
  })

  // Main stars
  c.stars.forEach((star, i) => {
    const a = s.starP[i] * gA
    if (a <= 0) return
    const x = star.nx * W, y = star.ny * H

    // Glow halo — kept subtle
    const g = ctx.createRadialGradient(x, y, 0, x, y, star.r * 4.5)
    g.addColorStop(0,   `rgba(160, 200, 255, ${0.32 * a})`)
    g.addColorStop(0.4, `rgba(120, 160, 255, ${0.10 * a})`)
    g.addColorStop(1,   `rgba(80,  120, 255, 0)`)
    ctx.beginPath()
    ctx.arc(x, y, star.r * 4.5, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()

    // Core dot
    ctx.beginPath()
    ctx.arc(x, y, star.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(200, 220, 255, ${a * 0.72})`
    ctx.fill()
  })

  // Peripheral stars
  c.peripheral.forEach((star, i) => {
    const a = s.periP[i] * gA * 0.62
    if (a <= 0) return
    const x = star.nx * W, y = star.ny * H
    ctx.beginPath()
    ctx.arc(x, y, star.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(180, 210, 255, ${a})`
    ctx.fill()
  })

}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BackgroundCanvas() {
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const texCanvasRef  = useRef<HTMLCanvasElement | null>(null)
  const planetGeomRef = useRef<{ r: number; cx: number; cy: number } | null>(null)
  const cStateRef     = useRef<CState>(freshCState(0))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let stars: Star[] = []
    const shooters: Shooter[] = Array.from({ length: 3 }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, speed: 0, life: 0, maxLife: 80, active: false,
    }))
    let W = 0, H = 0, frame = 0, nextSpawn = 240
    let grainTile: HTMLCanvasElement | null = null
    let grainPattern: CanvasPattern | null = null
    let lastTime = performance.now()
    // Cached static gradients — recreated only on resize
    let cachedBgG:  CanvasGradient | null = null
    let cachedMwG:  CanvasGradient | null = null
    let cachedNeb1: CanvasGradient | null = null
    let cachedNeb2: CanvasGradient | null = null

    let mouseX = -9999, mouseY = -9999
    let scrollProgress = 0

    // ── Init ─────────────────────────────────────────────────────────────────

    function initParticles() {
      W = canvas!.width  = window.innerWidth
      H = canvas!.height = window.innerHeight

      stars = initStars(W, H)

      // Planet geometry
      const PLANET_R  = W * 0.92
      const PLANET_CX = W / 2
      const PLANET_CY = H + PLANET_R * 0.72
      planetGeomRef.current = { r: PLANET_R, cx: PLANET_CX, cy: PLANET_CY }

      // Texture canvas — drawn once per resize
      const texCanvas  = document.createElement('canvas')
      texCanvas.width  = W
      texCanvas.height = H
      const texCtx     = texCanvas.getContext('2d')!

      for (let i = 0; i < 220; i++) {
        const angle = Math.PI * 0.85 + Math.random() * Math.PI * 0.30
        const dist  = PLANET_R * (0.82 + Math.random() * 0.16)
        const px    = PLANET_CX + Math.cos(angle) * dist
        const py    = PLANET_CY + Math.sin(angle) * dist
        if (px < -20 || px > W + 20 || py < -20 || py > H + 20) continue
        texCtx.save()
        texCtx.translate(px, py)
        texCtx.rotate(Math.random() * Math.PI)
        texCtx.beginPath()
        texCtx.ellipse(0, 0, Math.random() * 22 + 3, Math.random() * 7 + 1.5, 0, 0, Math.PI * 2)
        texCtx.fillStyle = `rgba(0,0,0,${Math.random() * 0.22 + 0.04})`
        texCtx.fill()
        texCtx.restore()
      }

      for (let i = 0; i < 12; i++) {
        const angle = Math.PI * 0.9 + Math.random() * Math.PI * 0.2
        const dist  = PLANET_R * (0.88 + Math.random() * 0.1)
        const px    = PLANET_CX + Math.cos(angle) * dist
        const py    = PLANET_CY + Math.sin(angle) * dist
        if (py > H || py < 0) continue
        texCtx.save()
        texCtx.translate(px, py)
        texCtx.rotate(angle + Math.PI / 2)
        texCtx.beginPath()
        texCtx.ellipse(0, 0, Math.random() * 60 + 20, Math.random() * 3 + 1, 0, 0, Math.PI * 2)
        texCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.03 + 0.01})`
        texCtx.fill()
        texCtx.restore()
      }

      texCanvasRef.current = texCanvas

      if (!grainTile) {
        grainTile    = buildGrainTile()
        grainPattern = ctx!.createPattern(grainTile, 'repeat')
      }

      // Rebuild background gradients for new W/H
      cachedBgG = ctx!.createRadialGradient(W * 0.5, H * 0.28, 0, W * 0.5, H * 0.28, W * 0.92)
      cachedBgG.addColorStop(0, 'rgba(6, 7, 16, 0.94)')
      cachedBgG.addColorStop(1, 'rgba(1, 1,  5, 1.0)')

      cachedMwG = ctx!.createLinearGradient(W * 0.04, H * 0.78, W * 0.96, H * 0.04)
      cachedMwG.addColorStop(0,    'transparent')
      cachedMwG.addColorStop(0.38, 'rgba(18, 24, 48, 0.014)')
      cachedMwG.addColorStop(0.50, 'rgba(22, 30, 56, 0.020)')
      cachedMwG.addColorStop(0.62, 'rgba(18, 24, 48, 0.014)')
      cachedMwG.addColorStop(1,    'transparent')

      cachedNeb1 = ctx!.createRadialGradient(W * 0.16, H * 0.17, 0, W * 0.16, H * 0.17, W * 0.28)
      cachedNeb1.addColorStop(0, 'rgba(10, 16, 44, 0.022)')
      cachedNeb1.addColorStop(1, 'transparent')

      cachedNeb2 = ctx!.createRadialGradient(W * 0.84, H * 0.21, 0, W * 0.84, H * 0.21, W * 0.20)
      cachedNeb2.addColorStop(0, 'rgba(28, 6, 46, 0.016)')
      cachedNeb2.addColorStop(1, 'transparent')
    }

    // ── Shooting stars ────────────────────────────────────────────────────────

    function spawnShooter() {
      const s = shooters.find(s => !s.active); if (!s) return
      s.x = W * 0.06 + Math.random() * W * 0.68; s.y = -8
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4
      s.speed = 5 + Math.random() * 8
      s.vx = Math.cos(angle) * s.speed; s.vy = Math.sin(angle) * s.speed
      s.maxLife = 50 + Math.random() * 80; s.life = 0; s.active = true
    }

    // ── Draw loop ─────────────────────────────────────────────────────────────

    function draw(timestamp: number) {
      if (!ctx) return
      frame++
      const dt = timestamp - lastTime
      lastTime = timestamp

      // Advance constellation state — purely delta-time, no timers
      updateCState(cStateRef.current, dt)

      // ─ Background (uses cached gradients — no allocations per frame) ────────
      ctx.fillStyle = '#01010a'; ctx.fillRect(0, 0, W, H)
      if (cachedBgG)  { ctx.fillStyle = cachedBgG;  ctx.fillRect(0, 0, W, H) }
      if (cachedMwG)  { ctx.fillStyle = cachedMwG;  ctx.fillRect(0, 0, W, H) }
      if (cachedNeb1) { ctx.fillStyle = cachedNeb1; ctx.fillRect(0, 0, W, H) }
      if (cachedNeb2) { ctx.fillStyle = cachedNeb2; ctx.fillRect(0, 0, W, H) }

      // ─ Planet layers A–F ──────────────────────────────────────────────────
      if (planetGeomRef.current) {
        const { r, cx, cy } = planetGeomRef.current

        // A — body fill
        const bodyGrad = ctx.createRadialGradient(
          cx - r * 0.18, cy - r * 0.22, r * 0.1,
          cx, cy, r
        )
        bodyGrad.addColorStop(0,   'rgba(44, 50, 52, 0.97)')
        bodyGrad.addColorStop(0.25,'rgba(26, 30, 32, 0.99)')
        bodyGrad.addColorStop(0.55,'rgba(14, 17, 19, 1.0)')
        bodyGrad.addColorStop(0.82,'rgba(7,  9,  11, 1.0)')
        bodyGrad.addColorStop(1.0, 'rgba(2,  3,  5,  1.0)')
        ctx.save()
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fillStyle = bodyGrad; ctx.fill()
        ctx.restore()

        // B — texture composite
        if (texCanvasRef.current) {
          ctx.save()
          ctx.globalCompositeOperation = 'multiply'
          ctx.globalAlpha = 0.85
          ctx.drawImage(texCanvasRef.current, 0, 0)
          ctx.globalCompositeOperation = 'source-over'
          ctx.globalAlpha = 1.0
          ctx.restore()
        }

        // C — atmospheric limb glow
        const limbGrad = ctx.createRadialGradient(cx, cy, r - 4, cx, cy, r + 36)
        limbGrad.addColorStop(0,    'rgba(60, 120, 100, 0.0)')
        limbGrad.addColorStop(0.28, 'rgba(70, 150, 130, 0.20)')
        limbGrad.addColorStop(0.55, 'rgba(90, 170, 150, 0.12)')
        limbGrad.addColorStop(0.78, 'rgba(60, 130, 110, 0.05)')
        limbGrad.addColorStop(1.0,  'rgba(30,  80,  70, 0.0)')
        ctx.save()
        ctx.beginPath(); ctx.arc(cx, cy, r + 18, 0, Math.PI * 2)
        ctx.fillStyle = limbGrad; ctx.fill()
        ctx.restore()

        // D — upper atmosphere fade (starts lower to match planet position)
        const atmTop  = H * 0.74
        const atmGrad = ctx.createLinearGradient(0, atmTop, 0, H)
        atmGrad.addColorStop(0,    'rgba(0,  0,  0,  0)')
        atmGrad.addColorStop(0.35, 'rgba(6,  14, 12, 0.28)')
        atmGrad.addColorStop(0.7,  'rgba(10, 20, 16, 0.48)')
        atmGrad.addColorStop(1.0,  'rgba(14, 24, 20, 0.62)')
        ctx.save()
        ctx.fillStyle = atmGrad
        ctx.fillRect(0, atmTop, W, H - atmTop)
        ctx.restore()

        // E — terminator shadow
        const termGrad = ctx.createLinearGradient(0, 0, W * 0.5, 0)
        termGrad.addColorStop(0,   'rgba(0, 0, 0, 0.42)')
        termGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.14)')
        termGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.04)')
        termGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)')
        ctx.save()
        ctx.beginPath(); ctx.arc(cx, cy, r + 40, 0, Math.PI * 2); ctx.clip()
        ctx.fillStyle = termGrad; ctx.fillRect(0, 0, W, H)
        ctx.restore()

        // F — specular highlight
        const specGrad = ctx.createRadialGradient(
          cx + r * 0.28, cy - r * 0.18, 0,
          cx + r * 0.28, cy - r * 0.18, r * 0.35
        )
        specGrad.addColorStop(0,   'rgba(180, 200, 190, 0.04)')
        specGrad.addColorStop(0.5, 'rgba(140, 170, 155, 0.02)')
        specGrad.addColorStop(1.0, 'rgba(0,   0,   0,   0)')
        ctx.save()
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip()
        ctx.fillStyle = specGrad; ctx.fillRect(0, 0, W, H)
        ctx.restore()
      }

      // ─ Stars ─────────────────────────────────────────────────────────────

      stars.forEach((star) => {
        star.t += star.speed * (dt / 16.67)

        const dx   = star.x - mouseX
        const dy   = star.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 110) {
          const strength = 1 - dist / 110
          star.hoverBrightness = Math.min(star.hoverBrightness + strength * 0.09, 1)
        } else {
          star.hoverBrightness = Math.max(star.hoverBrightness - 0.022, 0)
        }

        const scrollVisible = star.revealThreshold <= scrollProgress + 0.15
        const baseAlpha  = scrollVisible
          ? star.baseAlpha * (0.60 + 0.40 * Math.sin(star.t))
          : 0
        const finalAlpha = Math.min(baseAlpha + star.hoverBrightness * 0.68, 1.0)
        if (finalAlpha < 0.004) return

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fillStyle = STAR_RGBA[star.color](finalAlpha)
        ctx.fill()
      })

      // ─ Constellations ─────────────────────────────────────────────────────
      drawCState(ctx, cStateRef.current, W, H)

      // ─ Shooting stars ─────────────────────────────────────────────────────
      if (frame >= nextSpawn) {
        spawnShooter(); nextSpawn = frame + 260 + Math.floor(Math.random() * 420)
      }
      for (const s of shooters) {
        if (!s.active) continue
        s.x += s.vx; s.y += s.vy; s.life++
        const p = s.life / s.maxLife
        const a = p < 0.12 ? p / 0.12 : Math.max(0, 1 - (p - 0.12) / 0.88)
        if (a <= 0.01 || s.x > W + 200 || s.y > H + 100) { s.active = false; continue }

        const len   = 80 + s.speed * 10
        const tailX = s.x - s.vx * (len / s.speed)
        const tailY = s.y - s.vy * (len / s.speed)
        const grad  = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
        grad.addColorStop(0,   `rgba(255,255,255,${a * 0.9})`)
        grad.addColorStop(0.3, `rgba(200,220,255,${a * 0.45})`)
        grad.addColorStop(1,   'rgba(150,180,255,0)')
        ctx.save(); ctx.strokeStyle = grad; ctx.lineWidth = 1.1; ctx.lineCap = 'round'
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(tailX, tailY); ctx.stroke(); ctx.restore()
        const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 3.5)
        hg.addColorStop(0, `rgba(255,255,255,${a})`); hg.addColorStop(1, 'transparent')
        ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(s.x, s.y, 3.5, 0, Math.PI * 2); ctx.fill()
      }

      // ─ Film grain ─────────────────────────────────────────────────────────
      if (grainPattern) {
        ctx.save()
        const ox = Math.random() * 128, oy = Math.random() * 128
        ctx.translate(ox, oy)
        ctx.fillStyle = grainPattern
        ctx.globalAlpha = 0.26
        ctx.fillRect(-ox, -oy, W + 128, H + 128)
        ctx.globalAlpha = 1
        ctx.restore()
      }

      rafId = requestAnimationFrame(draw)
    }

    // ── Listeners ─────────────────────────────────────────────────────────────

    const onMouseMove  = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    const onMouseOut   = () => { mouseX = -9999; mouseY = -9999 }
    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight
      scrollProgress  = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0
    }
    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(initParticles, 120) }

    window.addEventListener('mousemove',  onMouseMove)
    window.addEventListener('mouseleave', onMouseOut)
    window.addEventListener('scroll',     handleScroll, { passive: true })
    window.addEventListener('resize',     onResize)

    // ── Boot ──────────────────────────────────────────────────────────────────

    initParticles()
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('mouseleave', onMouseOut)
      window.removeEventListener('scroll',     handleScroll)
      window.removeEventListener('resize',     onResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ willChange: 'transform' }}
    />
  )
}
