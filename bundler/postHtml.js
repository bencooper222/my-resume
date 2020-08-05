const posthtml = require('posthtml');
const { insertAt } = require('posthtml-insert-at');
const fs = require('fs');

const distHtmlPath = './dist/index.html';

exports.addOgImage = () => {
  const html = fs.readFileSync(distHtmlPath);

  posthtml()
    .use(
      insertAt({
        selector: 'head',
        append: '<meta property="og:image" content="/og.png">',
      }),
      insertAt({
        selector: 'head',
        append: '<meta name="twitter:card" content="summary_large_image">',
      }),
      insertAt({
        selector: 'head',
        append: '<meta name="twitter:image" content="https://resume.benc.io/og.png">',
      }),
    )
    .process(html)
    .then(result => fs.writeFileSync(distHtmlPath, result.html));
};
