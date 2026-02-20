import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const runtime = "nodejs";

export async function GET(req: Request) {
  let browser;

  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Título";
    const username = searchParams.get("username") || "user";
    const status = searchParams.get("status") || "finished";
    const type = searchParams.get("type") || "movie";
    const rating = searchParams.get("rating") || "";
    const theme = searchParams.get("theme") || "dark";

    // 1. Configuração do Browser (Otimizada para Serverless)
    browser = await puppeteer.launch({
      args: [...chromium.args, "--font-render-hinting=none"], // Melhora renderização de fontes
      executablePath: await chromium.executablePath(),
      headless: true,
      defaultViewport: {
        width: 1200, // Largura maior para evitar quebras de linha inesperadas
        height: 1200,
        deviceScaleFactor: 2, // Garante alta resolução (Retina)
      },
    });

    const page = await browser.newPage();
    
    // Evita cache excessivo que pode mostrar dados antigos
    await page.setCacheEnabled(false);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://archive-me.com";
    const url = `${baseUrl}/share-preview?title=${encodeURIComponent(title)}&username=${encodeURIComponent(username)}&status=${status}&type=${type}&rating=${rating}&theme=${theme}`;

    // 2. Navegação com timeout estendido
    await page.goto(url, {
      waitUntil: ["networkidle0", "domcontentloaded"], // Espera o tráfego de rede zerar
      timeout: 45000,
    });

    // 3. Blindagem de Fontes (Injeta e aguarda carregamento real)
    await page.addStyleTag({
      url: "https://fonts.googleapis.com",
    });

    // 4. A "Grande Validação": Conteúdo + Imagens + Layout
    await page.waitForFunction(
      (expectedRating) => {
        const el = document.querySelector("#share-card") as HTMLElement;
        if (!el) return false;

        // A. Verifica se as imagens estão prontas (tamanho > 0)
        const imgs = Array.from(document.images);
        const imgsLoaded = imgs.every(img => img.complete && img.naturalWidth > 0);

        // B. Verifica se o texto do rating já foi injetado (hidratação do React)
        const textIsReady = expectedRating ? el.innerText.includes(expectedRating) : el.innerText.length > 10;

        // C. Verifica se o elemento tem dimensões físicas
        const rect = el.getBoundingClientRect();
        const layoutReady = rect.width > 0 && rect.height > 0;

        return imgsLoaded && textIsReady && layoutReady;
      },
      { timeout: 25000 },
      rating
    );

    // 5. Finalização de Renderização (O "Pulo do Gato")
    await page.evaluate(async () => {
      // Garante que todas as fontes (incluindo as da página) foram baixadas
      await document.fonts.ready;
      
      // Força o navegador a processar o ciclo de pintura (paint)
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });
    });

    // Delay de segurança final para estabilização de transições CSS (se houver)
    await new Promise((r) => setTimeout(r, 500));

    // 6. Screenshot Preciso
    const element = await page.$("#share-card");
    if (!element) throw new Error("Elemento #share-card não encontrado");

    const screenshot = await element.screenshot({
      type: "png",
      omitBackground: true, // Útil se o card tiver bordas arredondadas
    });

    const buffer = Buffer.from(screenshot as Uint8Array);

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable", // Cache para performance
        "Content-Length": buffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error("ERRO CRÍTICO NA GERAÇÃO:", error.message);
    return new Response(`Erro ao gerar imagem: ${error.message}`, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
