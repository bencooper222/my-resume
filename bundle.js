const puppeteer = require('puppeteer');
const fs = require('fs');
const parcel = require('parcel-bundler');
const path = require('path');

async function printPDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:1234', { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'letter' });

  await browser.close();

  fs.writeFileSync('./dist/pdf.pdf', pdf);
  return pdf;
}

(async () => {
  printPDF();
  const bundler = new parcel(path.join(__dirname, './index.html'), {
    publicUrl: './',
    watch: false,
    minify: true,
    scopeHoist: true,
  });
  bundler.bundle();
})();
