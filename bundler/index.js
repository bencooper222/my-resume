const { watchForPdfAndImage } = require('./renderSite');
const { purifyFlow } = require('./purifyCss');
const { addOgImage } = require('./postHtml');

const parcel = require('parcel-bundler');

(async () => {
  const bundler = new parcel('./index.html', {
    publicUrl: './',
    watch: false,
    minify: true,
    scopeHoist: true,
  });
  await bundler.bundle();
  purifyFlow(); // needs to happen after parcel stuff

  await watchForPdfAndImage();
  await addOgImage();
})();
