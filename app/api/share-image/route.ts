import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

import { themes } from "@/components/share/themes";
import { fonts } from "@/components/share/fonts";

export const runtime = "nodejs";

export async function GET(req: Request) {
  let browser;

  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "Título";
    const username = searchParams.get("username") || "user";
    const status = searchParams.get("status") || "finished";
    const type = searchParams.get("type") || "movie";
    const rating = searchParams.get("rating") || "rating";
    const themeParam = searchParams.get("theme") || "dark";

    // valida tema
    const theme =
      themeParam in themes ? (themeParam as keyof typeof themes) : "dark";

    // URL da página que será printada
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://archive-me.com";

    const url = `${baseUrl}/share-preview?title=${encodeURIComponent(
      title
    )}&username=${encodeURIComponent(
      username
    )}&status=${status}&type=${type}&rating=${rating}&theme=${theme}`;

    // pega font do tema
    const selectedTheme = themes[theme];
    const fontKey = (selectedTheme?.font || "lexend") as keyof typeof fonts;
    const font = fonts[fontKey];

    // abre browser
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1200,
      height: 1200,
      deviceScaleFactor: 2,
    });

    // abre a página
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // espera o card existir
    await page.waitForSelector("#share-card", { timeout: 10000 });

    // injeta apenas a font do tema
    if (font) {
      await page.addStyleTag({
        content: `
          @font-face {
            font-family: '${font.name}';
            src: url('${baseUrl}/fonts/${font.file}') format('woff2');
            font-weight: 100 900;
            font-style: normal;
          }
        `,
      });

      // espera carregar a font
      await page.evaluate(() => document.fonts.ready);
    }

    // pequeno delay pra garantir render
    await new Promise((r) => setTimeout(r, 300));

    // tira screenshot
    const element = await page.$("#share-card");
    if (!element) throw new Error("Elemento #share-card não encontrado");

    const screenshot = await element.screenshot({
      type: "png",
      omitBackground: true,
    });

    const buffer = Buffer.from(screenshot as Uint8Array);

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error: any) {
    console.error("ERRO CRÍTICO NA GERAÇÃO:", error);
    return new Response(`Erro ao gerar imagem: ${error.message}`, {
      status: 500,
    });
  } finally {
    if (browser) await browser.close();
  }
}