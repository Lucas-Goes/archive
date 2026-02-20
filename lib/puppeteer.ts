import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function getBrowser() {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    const puppeteerFull = await import("puppeteer");
    return puppeteerFull.default.launch({
      headless: true,
    });
  }

  // Na Vercel
  return puppeteer.launch({
    args: chromium.args,
    // Definimos o viewport manualmente ou deixamos null para o padrão
    defaultViewport: { width: 1280, height: 720 }, 
    executablePath: await chromium.executablePath(),
    headless: true, 
  });
}
