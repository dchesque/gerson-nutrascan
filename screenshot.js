import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const screenshotDir = path.join(__dirname, 'attached_assets/real_screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const pages = [
      { url: 'http://localhost:5000/scan', name: 'scan-interface.png' },
      { url: 'http://localhost:5000/results', name: 'results-screen.png' },
    ];

    for (const pageInfo of pages) {
      try {
        console.log(`📸 Capturing: ${pageInfo.name}...`);
        const page = await browser.newPage();
        await page.setViewport({ width: 480, height: 960 });
        await page.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        const filepath = path.join(screenshotDir, pageInfo.name);
        await page.screenshot({ path: filepath, fullPage: true });
        console.log(`✓ Saved: ${filepath}`);
        await page.close();
      } catch (e) {
        console.log(`⚠️ Could not capture ${pageInfo.name}: ${e.message}`);
      }
    }

    console.log('✓ Screenshots complete!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

takeScreenshots();
