import express from "express";
import puppeteer from "puppeteer";
import { executablePath } from "puppeteer";
import path, { dirname } from "path";

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

    await page.setViewport({ width: 1400, height: 800 });

    // Navigate to the URL
    console.log("Navigating to : ", url);
    await page.goto(url, { waitUntil: "networkidle0", timeout: 0 });

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

captureWebsiteViewport("https://thebreezycompany.co", "example_viewport.png")
  .then((res) => {
    console.log("Saved");
  })
  .catch((error) => {
    console.log("Error at image capture : ", error);
  });

app.get("/", async (req, res) => {
  return res.send("Hello");
});

app.get("/image", async (req, res) => {
  return res.sendFile(dirname(import.meta.filename) + "/example_viewport.png");
});

app.get("/generate-thumbnail", async (req, res) => {
  const { url, filename } = req.query;
  await captureWebsiteViewport(url, `${filename}.png`)
    .then((res) => {
      console.log("Saved : ", filename);
    })
    .catch((error) => {
      console.log("Error at image capture : ", error);
    });
  return res.sendFile(dirname(import.meta.filename) + `/${filename}.png`);
});

app.listen(8000, () => {
  console.log("Server Started");
});
