export default function ScanlineOverlay() {
  return (
    <div
      className="fixed inset-0 z-10 pointer-events-none"
      style={{
        background:
          'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px)',
        opacity: 0.65,
      }}
    />
  )
}
