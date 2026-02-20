import { getBrowser } from "@/lib/puppeteer"; // Importe sua função atualizada
import { themes, ThemeName } from "@/components/share/themes";

export const runtime = "nodejs";
// Importante: Aumente o timeout para a função não morrer no cold start
export const maxDuration = 30; 

export async function GET(req: Request) {
  try {
    const { searchParams, origin } = new URL(req.url);

    const title = searchParams.get("title") || "Título";
    const username = searchParams.get("username") || "user";
    const status = searchParams.get("status") || "finished";
    const type = searchParams.get("type") || "movie";
    const rating = searchParams.get("rating") || "";
    const themeParam = searchParams.get("theme");
    const theme: ThemeName =
      themeParam && themeParam in themes
        ? (themeParam as ThemeName)
        : "dark";

    // 1. ABRIR BROWSER USANDO A FUNÇÃO AUXILIAR
    const browser = await getBrowser();
    const page = await browser.newPage();

    // 2. VIEWPORT
    await page.setViewport({
      width: 360,
      height: 640,
      deviceScaleFactor: 3,
    });

    // 3. URL DINÂMICA (localhost ou produção)
    // origin detecta automaticamente se é http://localhost:3000 ou https://seu-site.vercel.app
    const url = `${origin}/share-preview?title=${encodeURIComponent(title)}&username=${encodeURIComponent(username)}&status=${status}&type=${type}&rating=${rating}&theme=${theme}`;

    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    // 4. PEGAR ELEMENTO
    const element = await page.$("#share-card");

    if (!element) {
      await browser.close();
      throw new Error("Share card not found");
    }

    // 5. SCREENSHOT
    const screenshot = await element.screenshot({
      type: "png",
    });

    await browser.close();

    // 6. CONVERTER PARA BUFFER (Resolve o erro de tipagem)
    const buffer = Buffer.from(screenshot); 

    // 7. RESPONSE
    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": buffer.length.toString(), // Boa prática para imagens
      },
    });

  } catch (error) {
    console.error(error);
    return new Response("Erro ao gerar imagem", { status: 500 });
  }
}
