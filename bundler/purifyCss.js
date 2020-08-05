const fs = require('fs');
const purify = require('purify-css');

exports.purifyFlow = () => {
  const fileReadWithEncoding = path => fs.readFileSync(path, { encoding: 'utf8' });
  const html = fileReadWithEncoding('dist/index.html');
  const cssFiles = fs.readdirSync('dist').filter(el => el.slice(-3) === 'css');

  cssFiles.forEach(file => {
    const fullPath = `dist/${file}`;
    purify(html, fileReadWithEncoding(fullPath), {
      output: fullPath,
      minify: true,
      info: false,
    });
  });
};
