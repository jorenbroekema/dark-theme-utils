const husky = require('husky');

const isCi = process.env.CI !== undefined;
if (!isCi) {
  husky.install();
}
