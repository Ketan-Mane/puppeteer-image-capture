import express from "express";
import puppeteer from "puppeteer";
import { executablePath } from "puppeteer";

const app = express();

async function captureWebsiteViewport(
  url,
  outputPath = "viewport_screenshot.png"
) {
  let browser;
  try {
    console.log("Chrome Path : ", executablePath());
    browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath(),
    });
    const page = await browser.newPage();

    // Navigate to the URL
    await page.goto(url, { waitUntil: "networkidle0" });

    // Capture only the viewport screenshot
    await page.screenshot({ path: outputPath, fullPage: false });

    console.log(`Viewport screenshot saved to ${outputPath}`);

    await browser.close();
  } catch (error) {
    console.error("Error capturing viewport screenshot:", error);
  } finally {
    if (browser) await browser.close();
  }
}

app.get("/", async (req, res) => {
  const urls = [
    "https://thebreezycompany.co",
    "https://thebreezycompany.co",
    "https://thebreezycompany.co",
  ];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    await captureWebsiteViewport(url, `output_${i}.png`);
  }
  return res.send("Hello");
});

app.listen(8000, () => {
  console.log("Server Started");
});
