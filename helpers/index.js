const fs = require('fs');
const path = require('path');

const helpers = {};

// Read all .js files in the helpers directory except index.js
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .forEach(file => {
    const helperName = path.basename(file, '.js');
    helpers[helperName] = require(`./${file}`);
  });

module.exports = helpers;
