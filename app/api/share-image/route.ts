export const runtime = "nodejs";
export const maxDuration = 30;

import { getBrowser } from "@/lib/puppeteer";

export async function GET() {
  try {
    console.log("START");

    const browser = await getBrowser();
    console.log("BROWSER OK");

    const page = await browser.newPage();
    console.log("PAGE OK");

    await page.setViewport({
      width: 1200,
      height: 630,
    });

    console.log("VIEWPORT OK");

    await page.setContent(`
      <html>
        <body style="background:black;color:white;display:flex;align-items:center;justify-content:center;height:100vh;">
          <h1>Archive</h1>
        </body>
      </html>
    `);

    console.log("CONTENT LOADED");

    const buffer = await page.screenshot({
      type: "png",
    });

    console.log("SCREENSHOT DONE");

    await browser.close();

    return new Response(Buffer.from(buffer), {
      headers: {
        "Content-Type": "image/png",
      },
    });

  } catch (err) {
    console.error("ERROR:", err);
    return new Response("Erro ao gerar imagem", { status: 500 });
  }
}