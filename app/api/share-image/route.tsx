import { ImageResponse } from '@vercel/og';
import { themes, ThemeName } from "@/components/share/themes";

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "Título";
    const username = searchParams.get("username") || "user";
    const status = searchParams.get("status") || "finished";
    const type = searchParams.get("type") || "movie";
    const rating = searchParams.get("rating") || "";
    const themeParam = searchParams.get("theme");
    
    const themeName: ThemeName =
      themeParam && themeParam in themes
        ? (themeParam as ThemeName)
        : "dark";

    const ThemeComponent = themes[themeName] as any; 

    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
          <ThemeComponent 
            title={title}
            username={username}
            status={status}
            type={type}
            rating={rating}
          />
        </div>
      ),
      {
        // Certifique-se de que estes valores são números, sem aspas
        width: 360,
        height: 640,
      }
    );
  } catch (error: any) {
    console.error(error);
    return new Response(`Erro ao gerar imagem`, { status: 500 });
  }
}
