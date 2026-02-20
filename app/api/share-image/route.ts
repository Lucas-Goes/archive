export const runtime = "nodejs";
export const maxDuration = 30;

import { getBrowser } from "@/lib/puppeteer";

export async function GET() {
  console.log("START");

  const browser = await getBrowser();
  console.log("BROWSER OK");

  const page = await browser.newPage();
  console.log("PAGE OK");

  await page.setViewport({
    width: 1200,
    height: 630,
  });

  await page.setContent(`
    <html>
      <body style="background:black;color:white;display:flex;align-items:center;justify-content:center;height:100vh;">
        <h1>Archive</h1>
      </body>
    </html>
  `, {
    waitUntil: "networkidle0",
  });

  console.log("CONTENT LOADED");

  await new Promise((r) => setTimeout(r, 300));

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
}