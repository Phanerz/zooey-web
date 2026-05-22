import BackgroundCanvas from '@/components/landing/BackgroundCanvas'
import ScanlineOverlay from '@/components/landing/ScanlineOverlay'
import VignetteOverlay from '@/components/landing/VignetteOverlay'
import Logo from '@/components/landing/Logo'
import StatusBar from '@/components/landing/StatusBar'
import Hero from '@/components/landing/Hero'
import RadialNav from '@/components/landing/RadialNav'

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#030304]">
      <BackgroundCanvas />
      <ScanlineOverlay />
      <VignetteOverlay />

      {/* Topbar */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-9 pt-[22px] animate-fade-up"
        style={{ animationDelay: '100ms' }}
      >
        <Logo />
        <StatusBar />
      </div>

      {/* Hero */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pb-[220px]">
        <Hero />
      </div>

      {/* Radial nav */}
      <RadialNav />
    </main>
  )
}
