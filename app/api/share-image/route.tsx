import { ImageResponse } from '@vercel/og';

// Opcional: O runtime 'edge' é muito mais rápido e barato que o 'nodejs'
export const runtime = 'edge';

export async function GET() {
  try {
    return new ImageResponse(
      (
        // O layout em JSX substitui o page.setContent
        <div
          style={{
            backgroundColor: 'black',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
          }}
        >
          <h1 style={{ fontSize: 80, fontWeight: 'bold' }}>Archive</h1>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Erro ao gerar imagem`, { status: 500 });
  }
}
