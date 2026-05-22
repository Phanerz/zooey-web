export default function VignetteOverlay() {
  return (
    <div
      className="fixed inset-0 z-10 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse at 50% 40%, transparent 38%, rgba(0,0,0,0.42) 72%, rgba(0,0,0,0.78) 100%)',
      }}
    />
  )
}
