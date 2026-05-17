import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Miroki — Stop Rebuilding. Start Finishing.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0D0B09',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{
            fontSize: 32,
            fontWeight: 500,
            color: '#F5EFE6',
            letterSpacing: '0.02em',
          }}>
            Miroki
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 16, height: 4, borderRadius: 2, background: '#7A9E6F' }} />
            <div style={{ width: 16, height: 4, borderRadius: 2, background: '#7A9E6F' }} />
            <div style={{ width: 16, height: 4, borderRadius: 2, background: '#7A9E6F' }} />
            <div style={{ width: 16, height: 4, borderRadius: 2, background: '#2A2420' }} />
            <div style={{ width: 16, height: 4, borderRadius: 2, background: '#2A2420' }} />
          </div>
        </div>

        {/* Hero text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span style={{
              fontSize: 80,
              fontWeight: 600,
              color: '#F5EFE6',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}>
              Stop Rebuilding.
            </span>
            <span style={{
              fontSize: 80,
              fontWeight: 600,
              color: '#7A9E6F',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}>
              Start Finishing.
            </span>
          </div>
          <span style={{
            fontSize: 28,
            color: '#8C7B6E',
            fontWeight: 400,
            maxWidth: 700,
          }}>
            AI lets you build anything. Miroki helps you finish something.
          </span>
        </div>

        {/* Bottom tag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: '#161210',
          border: '1px solid #2A2420',
          borderRadius: 12,
          padding: '12px 20px',
          alignSelf: 'flex-start',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7A9E6F' }} />
          <span style={{ fontSize: 18, color: '#8C7B6E' }}>miroki.app</span>
        </div>
      </div>
    ),
    { ...size }
  )
}