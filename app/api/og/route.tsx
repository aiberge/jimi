import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Using absolute URL for edge function compatibility */}
            <div
              style={{
                width: '200px',
                height: '200px',
                marginRight: '2rem',
                background: 'url(https://oualidcar.com/logo.png)',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}>
              <div style={{ 
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#1a365d'
              }}>
                Ouail Car
              </div>
              <div style={{ 
                fontSize: '36px',
                color: '#4a5568',
                marginTop: '1rem'
              }}>
                Location de Voitures à Fès
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'content-type': 'image/png',
          'cache-control': 'public, max-age=31536000, immutable'
        },
      },
    )
  } catch {
    // Return a fallback image in case of any error
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 24,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          Failed to generate image
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'content-type': 'image/png',
          'cache-control': 'public, max-age=31536000, immutable'
        },
      }
    )
  }
}
