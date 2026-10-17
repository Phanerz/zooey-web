'use client';

import { useState } from 'react';

const fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

const features = [
  {
    title: 'One hotkey',
    description: 'Press a single shortcut to summon Zooey from anywhere on your desktop. No app switching, no tab hunting.',
  },
  {
    title: 'Works everywhere',
    description: 'Zooey lives alongside every app you use — your browser, your editor, your terminal. Always one keystroke away.',
  },
  {
    title: 'Actually remembers you',
    description: 'Zooey builds a persistent memory of your preferences, projects, and conversations. It gets better the more you use it.',
  },
];

export default function HomeApp({ onWaitlist }) {
  const [hoveredBtn, setHoveredBtn] = useState(null);

  return (
    <div style={{ fontFamily, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <div
        style={{
          background: '#030304',
          padding: '80px 24px 64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Your AI. Always there.
        </h1>
        <p
          style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.6)',
            margin: '16px 0 0',
            lineHeight: 1.4,
          }}
        >
          One hotkey. Any app. Zero switching.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 32,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <a
            href="/download/mac"
            onMouseEnter={() => setHoveredBtn('mac')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              background: hoveredBtn === 'mac' ? '#0066d6' : '#007AFF',
              border: 'none',
              borderRadius: 8,
              height: 44,
              padding: '0 24px',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 500,
              fontFamily,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            Download for Mac
          </a>
          <a
            href="/download/windows"
            onMouseEnter={() => setHoveredBtn('win')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              background: hoveredBtn === 'win' ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 8,
              height: 44,
              padding: '0 24px',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 500,
              fontFamily,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            Download for Windows
          </a>
        </div>
      </div>

      {/* Feature cards */}
      <div
        style={{
          background: '#f5f5f7',
          padding: '48px 24px',
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        {features.map((f) => (
          <div
            key={f.title}
            style={{
              background: '#ffffff',
              borderRadius: 10,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              padding: 24,
              flex: '1 1 240px',
              maxWidth: 320,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#1d1d1f',
                margin: '0 0 8px',
              }}
            >
              {f.title}
            </h3>
            <p style={{ fontSize: 13, color: '#1d1d1f', margin: 0, lineHeight: 1.5 }}>
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
