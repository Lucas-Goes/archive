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

  const executablePath =
  process.env.NODE_ENV === "production"
    ? await chromium.executablePath()
    : undefined;

    return puppeteer.launch({
    args: [...chromium.args, "--no-sandbox"],
    executablePath,
    headless: true,
    defaultViewport: { width: 360, height: 640 },
    });
}