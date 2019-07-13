const r = require('puppeteer');
const fs = require('fs');
const parcel = require('parcel-bundler');
const path = require('path');
const finalhandler = require('finalhandler');
const http = require('http');
const serveStatic = require('serve-static');
const chokidar = require('chokidar');

const PORT = 1234;
const pdfName = 'resume';

async function printPDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'letter' });

  await browser.close();

  fs.writeFileSync(`./dist/${pdfName}.pdf`, pdf);
  return pdf;
}

(async () => {
  const bundler = new parcel(path.join(__dirname, './index.html'), {
    publicUrl: './',
    watch: false,
    minify: true,
    scopeHoist: true,
  });
  bundler.bundle();

  const serve = serveStatic('dist', { index: ['index.html'] });
  const server = http.createServer(function onRequest(req, res) {
    serve(req, res, finalhandler(req, res));
  });
  server.listen(PORT);

  printPDF();

  const closeServer = path => {
    if (path === `dist/${pdfName}.pdf`) {
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
