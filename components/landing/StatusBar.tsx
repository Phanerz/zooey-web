export default function StatusBar() {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-[5px] h-[5px] rounded-full animate-pulse-dot"
        style={{ background: 'rgba(255,255,255,0.7)', boxShadow: '0 0 6px rgba(255,255,255,0.4)' }}
      />
      <span className="font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
        STATUS:{' '}
        <span style={{ color: 'rgba(255,255,255,0.55)' }}>ONLINE</span>
      </span>
    </div>
  )
}
