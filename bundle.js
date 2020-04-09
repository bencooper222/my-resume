const fs = require('fs');
const path = require('path');

const parcel = require('parcel-bundler');
const puppeteer = require('puppeteer');

const finalhandler = require('finalhandler');
const http = require('http');
const serveStatic = require('serve-static');

const chokidar = require('chokidar');

const PORT = 1234;
const pdfName = 'resume';

async function printPDFAndImage() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'letter' });
  await page.screenshot({ path: `./dist/og.png` }); // TODO: add clip property

  await browser.close();

  fs.writeFileSync(`./dist/${pdfName}.pdf`, pdf);
  return pdf;
}

(async () => {
  const fullPdfPath = `./dist/${pdfName}.pdf`;
  // need to delete file to allow rebuild
  if (fs.existsSync(fullPdfPath)) fs.unlinkSync(fullPdfPath);

  const bundler = new parcel(path.join(__dirname, './index.html'), {
    publicUrl: './',
    watch: false,
    minify: true,
    scopeHoist: true,
  });
  await bundler.bundle();
  // purifyFlow(); // needs to happen after parcel stuff

  const server = http.createServer(function onRequest(req, res) {
    serveStatic('dist', { index: ['index.html'] })(req, res, finalhandler(req, res));
  });
  server.listen(PORT);

  printPDFAndImage();

  const closeServer = path => {
    if (path === fullPdfPath.slice(2)) {
      console.log(`server closed because ${path} added`);
      server.close();
      watcher.close();
      process.exit(0);
    }
  };

  const watcher = chokidar
    .watch(`.`, {
      ignored: /node_modules|.git|.cache/,
    })
    .on('add', closeServer);
})();
