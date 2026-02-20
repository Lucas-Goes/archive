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

    // URL da página que será printada
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://archive-me.com";

    const url = `${baseUrl}/share-preview?title=${encodeURIComponent(
      title
    )}&username=${encodeURIComponent(
      username
    )}&status=${status}&type=${type}&rating=${rating}&theme=${theme}`;

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

    // espera fontes carregarem
    await page.evaluate(() => document.fonts.ready);

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