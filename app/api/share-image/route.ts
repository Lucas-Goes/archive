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

    // -------------------------
    // 1. BROWSER
    // -------------------------
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

    const url = `${baseUrl}/share-preview?title=${encodeURIComponent(
      title
    )}&username=${encodeURIComponent(
      username
    )}&status=${status}&type=${type}&rating=${rating}&theme=${theme}`;

    console.log("URL:", url);

    // -------------------------
    // 3. LOAD PAGE
    // -------------------------
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // -------------------------
// ESPERAR CARD
// -------------------------
await page.waitForSelector("#share-card", {
  visible: true,
  timeout: 20000,
});

// -------------------------
// ESPERAR TEXTO + LAYOUT
// -------------------------
await page.waitForFunction(() => {
  const el = document.querySelector("#share-card") as HTMLElement | null;
  if (!el) return false;

  const hasText = el.innerText && el.innerText.length > 10;
  const rect = el.getBoundingClientRect();

  return hasText && rect.width > 0 && rect.height > 0;
});

// -------------------------
// ESPERAR IMAGENS
// -------------------------
await page.waitForFunction(() => {
  const images = Array.from(document.images);
  return images.every((img) => img.complete);
}, { timeout: 30000 });

// -------------------------
// ESPERAR IMAGEM REAL
// -------------------------
await page.waitForFunction(() => {
  const img = document.querySelector("img");
  if (!img) return true;

  return img.naturalWidth > 0;
});

// -------------------------
// ESPERAR FONTES
// -------------------------
await page.evaluate(async () => {
  await document.fonts.ready;
});

// -------------------------
// ESPERAR PAINT FINAL
// -------------------------
await page.evaluate(() => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
});

    await page.addStyleTag({
      url: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
    });

    await page.waitForFunction(() => {
      return document.styleSheets.length > 0;
    });

    await new Promise((r) => setTimeout(r, 300));

    // -------------------------
    // 9. SCREENSHOT
    // -------------------------
    const element = await page.$("#share-card");

    if (!element) {
      throw new Error("Share card not found");
    }

    const screenshot = await element.screenshot({
      type: "png",
    });

    const buffer =
      screenshot instanceof Buffer
        ? screenshot
        : Buffer.from(screenshot as Uint8Array);

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("ERRO:", error);
    return new Response("Erro ao gerar imagem", { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}