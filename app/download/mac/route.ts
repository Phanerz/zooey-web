import { NextResponse } from 'next/server'

const FALLBACK = 'https://github.com/Phanerz/zooey-download/releases/latest'

export async function GET() {
  try {
    const res = await fetch(
      'https://api.github.com/repos/Phanerz/zooey-download/releases/latest',
      {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: 300 },
      }
    )
    if (!res.ok) return NextResponse.redirect(FALLBACK, 302)
    const release = await res.json()
    const asset = release.assets?.find((a: { name: string }) => a.name.endsWith('.dmg'))
    if (!asset) return NextResponse.redirect(FALLBACK, 302)
    return NextResponse.redirect(asset.browser_download_url, 302)
  } catch {
    return NextResponse.redirect(FALLBACK, 302)
  }
}
