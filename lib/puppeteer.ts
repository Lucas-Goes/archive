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


  const executablePath = await chromium.executablePath();

  return puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: true,
    defaultViewport: { width: 1200, height: 630 },
  });
}