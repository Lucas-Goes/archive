import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

import { themes, ThemeName } from "@/components/share/themes";

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
    const themeParam = searchParams.get("theme");

    const theme: ThemeName =
      themeParam && themeParam in themes
        ? (themeParam as ThemeName)
        : "dark";

    // -------------------------
    // 1. BROWSER
    // -------------------------
    console.log("INICIANDO BROWSER...");

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
      defaultViewport: {
        width: 360,
        height: 640,
        deviceScaleFactor: 2,
      },
    });

    const page = await browser.newPage();

    // -------------------------
    // 2. URL
    // -------------------------
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://archive-me.com";

    console.log("BASE URL:", baseUrl);

    const url = `${baseUrl}/share-preview?title=${encodeURIComponent(
      title
    )}&username=${encodeURIComponent(
      username
    )}&status=${status}&type=${type}&rating=${rating}&theme=${theme}`;

    console.log("URL FINAL:", url);

    // -------------------------
    // 3. ABRIR PÁGINA
    // -------------------------
    console.log("ABRINDO PÁGINA...");

    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    console.log("ABRIU PAGINA");

    // -------------------------
    // 4. ESPERAR ELEMENTO
    // -------------------------
    await page.waitForSelector("#share-card", {
      timeout: 15000,
    });

    console.log("ELEMENTO EXISTE");

    // -------------------------
    // 5. ESPERAR IMAGENS
    // -------------------------
    //await page.evaluate(async () => {
    //  const images = Array.from(document.images);
//
    //  await Promise.all(
    //    images.map((img) => {
    //      if (img.complete) return;
//
    //      return new Promise((resolve) => {
    //        img.onload = resolve;
    //        img.onerror = resolve;
    //      });
    //    })
    //  );
    //});

    console.log("IMAGENS OK");

    // -------------------------
    // 6. ESPERAR FONTES
    // -------------------------
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    await page.evaluate(() => {
      document.body.style.margin = "0";
    });

    await page.addStyleTag({
      url: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
    });

    console.log("FONTES OK");

    // -------------------------
    // 7. DELAY FINAL
    // -------------------------
    await new Promise((r) => setTimeout(r, 300));

    // -------------------------
    // 8. PEGAR ELEMENTO
    // -------------------------
    console.log("PEGANDO ELEMENT...");

    const element = await page.waitForSelector("#share-card", {
      visible: true,
      timeout: 20000,
    });

    if (!element) {
      throw new Error("Share card not found");
    }

    console.log("PEGOU ELEMENT");

    // -------------------------
    // 9. SCREENSHOT
    // -------------------------
    console.log("GERANDO SCREENSHOT...");

    const screenshot = await element.screenshot({
      type: "png",
    });

    console.log("SCREENSHOT OK");

    // -------------------------
    // 10. NORMALIZAR BUFFER (CRÍTICO)
    // -------------------------
    const buffer =
      screenshot instanceof Buffer
        ? screenshot
        : Buffer.from(screenshot as Uint8Array);

    console.log("BUFFER OK:", buffer.length);

    // -------------------------
    // 11. RESPONSE
    // -------------------------
    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error("ERRO COMPLETO:", error);
    console.error("STACK:", (error as Error)?.stack);

    return new Response("Erro ao gerar imagem", {
      status: 500,
    });

  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log("BROWSER FECHADO");
      } catch (e) {
        console.error("ERRO AO FECHAR BROWSER:", e);
      }
    }
  }
}