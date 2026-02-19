import puppeteer from "puppeteer";
import { themes, ThemeName } from "@/components/share/themes";




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
    // 1. ABRIR BROWSER
    // -------------------------
    const browser = await puppeteer.launch({
      headless: true, 
    });

    const page = await browser.newPage();

    // -------------------------
    // 2. VIEWPORT
    // -------------------------
    await page.setViewport({
      width: 360,
      height: 640,
      deviceScaleFactor: 3,
    });

    // -------------------------
    // 3. URL DO PREVIEW
    // -------------------------
    const url = `http://localhost:3000/share-preview?title=${encodeURIComponent(
      title
    )}&username=${encodeURIComponent(
      username
    )}&status=${status}&type=${type}&rating=${rating}&theme=${theme}`;

    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    // -------------------------
    // 4. PEGAR ELEMENTO
    // -------------------------
    const element = await page.$("#share-card");

    if (!element) {
      throw new Error("Share card not found");
    }

    // -------------------------
    // 5. SCREENSHOT
    // -------------------------
    const screenshot = await element.screenshot({
      type: "png",
    });

    await browser.close();

    // -------------------------
    // 6. CONVERTER BUFFER (🔥 FIX)
    // -------------------------
    const buffer = Buffer.from(screenshot as Uint8Array);

    // -------------------------
    // 7. RESPONSE
    // -------------------------
    return new Response(buffer, {
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
