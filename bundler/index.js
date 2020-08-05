const { watchForPdfAndImage } = require('./renderSite');
const { purifyFlow } = require('./purifyCss');
const { addOgImage } = require('./postHtml');

const Parcel = require('parcel-bundler');

const bundle = async () => {
  console.log('Start bundling');
  const bundler = new Parcel('./index.html', {
    publicUrl: './',
    watch: false,
    minify: true,
    scopeHoist: true,
    logLevel: 1,
  });
  await bundler.bundle();
  console.log('Start purifying');
  purifyFlow(); // needs to happen after parcel stuff

  console.log('Start screenshotting PDF and image');
  await watchForPdfAndImage();

  console.log('Start adding og:image to html');
  await addOgImage();

  console.log('Finish');
  process.exit(0);
};

bundle().catch(err => {
  console.error(err);
  process.exit(1);
});
