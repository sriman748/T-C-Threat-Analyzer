// server.js
const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/fetch", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: "Missing 'url' query parameter." });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new", // for latest Chrome behavior
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );
    await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Remove unnecessary elements for clean parsing
    await page.evaluate(() => {
      document.querySelectorAll("script, style, noscript, iframe, link, svg").forEach(el => el.remove());
    });

    const content = await page.content();
    await browser.close();

    res.send(content);
  } catch (error) {
    console.error("❌ Puppeteer fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch content via Puppeteer." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Puppeteer proxy server running at http://localhost:${PORT}`);
});
