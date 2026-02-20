import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

import { themes, ThemeName } from "@/components/share/themes";

export const runtime = "nodejs"; // importante na Vercel

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
    // 1. ABRIR BROWSER (ADAPTADO)
    // -------------------------
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: {
        width: 360,
        height: 640,
        deviceScaleFactor: 3,
      },
      executablePath: await chromium.executablePath()
    });

    const page = await browser.newPage();

    // -------------------------
    // 2. URL DO PREVIEW
    // -------------------------
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://archive-me.com";

    console.log('OLHA_ISSO_MANO', baseUrl)    

    const url = `${baseUrl}/share-preview?title=${encodeURIComponent(
      title
    )}&username=${encodeURIComponent(
      username
    )}&status=${status}&type=${type}&rating=${rating}&theme=${theme}`;

    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    // -------------------------
    // 3. PEGAR ELEMENTO
    // -------------------------
    await page.waitForSelector("#share-card", {
      timeout: 15000,
    });

    // pequeno delay pra garantir layout
    await new Promise((r) => setTimeout(r, 500));
    
    const element = await page.$("#share-card");

    if (!element) {
      throw new Error("Share card not found");
    }

    // -------------------------
    // 4. SCREENSHOT
    // -------------------------
    const screenshot = await element.screenshot({
      fullPage: true,
    });

    await browser.close();

    // -------------------------
    // 5. RESPONSE
    // -------------------------
    const uint8 = new Uint8Array(screenshot as Uint8Array);

    return new Response(uint8, {
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