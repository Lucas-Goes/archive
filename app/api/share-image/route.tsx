import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

import { themes, ThemeName } from "@/components/share/themes";

export const runtime = "nodejs";

export async function GET(req: Request) {
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
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: {
        width: 360,
        height: 640,
        deviceScaleFactor: 3,
      },
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    // -------------------------
    // 2. URL
    // -------------------------
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://archive-me.com";

    const url = `${baseUrl}/share-preview?title=${encodeURIComponent(
      title
    )}&username=${encodeURIComponent(
      username
    )}&status=${status}&type=${type}&rating=${rating}&theme=${theme}`;

    // -------------------------
    // 3. ABRIR PÁGINA
    // -------------------------
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    // -------------------------
    // 4. ESPERAR ELEMENTO
    // -------------------------
    await page.waitForSelector("#share-card", {
      timeout: 15000,
    });

    // -------------------------
    // 5. ESPERAR IMAGENS
    // -------------------------
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images.map((img) => {
          if (img.complete) return;
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
    });

    // -------------------------
    // 6. ESPERAR FONTES
    // -------------------------
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    // -------------------------
    // 7. DELAY FINAL
    // -------------------------
    await new Promise((r) => setTimeout(r, 300));

    // -------------------------
    // 8. PEGAR ELEMENTO (AGORA SIM)
    // -------------------------
    const element = await page.$("#share-card");

    if (!element) {
      throw new Error("Share card not found");
    }

    // -------------------------
    // 9. SCREENSHOT
    // -------------------------
    const screenshot = await element.screenshot({
      type: "png",
    });

    await browser.close();

    return new Response(new Uint8Array(screenshot as Uint8Array), {
      headers: {
        "Content-Type": "image/png",
      },
    });

  } catch (error) {
    console.error(error);
    return new Response("Erro ao gerar imagem", {
      status: 500,
    });
  }
}