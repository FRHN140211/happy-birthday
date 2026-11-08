import { chromium } from 'playwright';

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1800 } });
await page.goto('http://localhost:3001/', { waitUntil: 'load' });
await page.evaluate(() => {
  const el = document.querySelector('.envelope-button');
  if (el) el.click();
});
await page.waitForTimeout(600);
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) => b.textContent && b.textContent.toLowerCase().includes('open the letter'));
  if (btn) btn.click();
});
await page.waitForTimeout(600);
for (let i = 1; i <= 3; i++) {
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent && b.textContent.toLowerCase().includes('next'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(800);
}
const files = [
  'c:/Users/Acer/Downloads/divaworld/cortis/download (1).jpg',
  'c:/Users/Acer/Downloads/divaworld/cortis/james.jpg',
  'c:/Users/Acer/Downloads/divaworld/longshot/Louis.jpg',
  'c:/Users/Acer/Downloads/divaworld/longshot/Lngshot Ryul.jpg'
];
await page.locator('input[type="file"][accept="image/*"][multiple]').setInputFiles(files);
await page.waitForTimeout(8000);
const templateNames = [ 'Pink Coquette', 'Cherry Vintage', 'Sweet Scrapbook', 'Dreamy Sky'];
for (const name of templateNames) {
  const btn = page.locator('[role="radio"]').filter({ hasText: name }).first();
  await btn.click();
  await page.waitForTimeout(2500);
  const info = await page.locator('img.booth-result-image').evaluate((img) => ({
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    visible: !!(img.naturalWidth && img.naturalHeight),
    width: img.width,
    height: img.height,
    isBlank: img.naturalWidth > 0 && img.naturalHeight > 0 && img.width > 0 && img.height > 0
  }));
  console.log(name, JSON.stringify(info));
}
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.locator('button:has-text("DOWNLOAD MY PHOTO STRIP")').click()
]);
console.log('download filename', await download.suggestedFilename());
await page.screenshot({ path: 'photobooth-final-verify-2.png', fullPage: true });
await browser.close();
