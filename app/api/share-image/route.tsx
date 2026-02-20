import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Título";

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000', // Use hex para garantir
          color: '#fff',
        }}
      >
        <h1 style={{ fontSize: 60 }}>{title}</h1>
      </div>
    ),
    {
      width: 360,
      height: 640,
    }
  );
}
