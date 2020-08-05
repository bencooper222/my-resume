const puppeteer = require('puppeteer');
const fs = require('fs');
const finalhandler = require('finalhandler');
const http = require('http');
const serveStatic = require('serve-static');
const chokidar = require('chokidar');

const pdfName = 'resume';
const fullPdfPath = `./dist/${pdfName}.pdf`;
const PORT = 1234;

const printPDFAndImage = async function() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'letter' });

  page.setViewport({ width: 1200, height: 1080 });
  await page.screenshot({
    path: `./dist/og.png`,

    clip: {
      width: 1200,
      height: 630,

      y: -100,
      x: -500,
    },
  }); // TODO: add clip property

  await browser.close();

  fs.writeFileSync(`./dist/${pdfName}.pdf`, pdf);
  return pdf;
};

exports.watchForPdfAndImage = () => {
  // need to delete file to allow rebuild
  if (fs.existsSync(fullPdfPath)) fs.unlinkSync(fullPdfPath);

  const server = http.createServer(function onRequest(req, res) {
    serveStatic('dist', { index: ['index.html'] })(req, res, finalhandler(req, res));
  });
  server.listen(PORT);

  return new Promise((res, rej) => {
    printPDFAndImage();
    const watcher = chokidar
      .watch(`.`, {
        ignored: /node_modules|.git|.cache/,
      })
      .on('add', path => {
        if (path === fullPdfPath.slice(2)) {
          console.log(`server closed because ${path} added`);
          watcher.close();
          server.close();
          res();
        }
      });
  });
};
