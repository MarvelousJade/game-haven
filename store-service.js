const path = require('path');
const fs = require('fs');

let items = [];
let categories = [];

module.exports.initialize = function() {
  const itemsPath = path.join(__dirname, 'data/items.json');
  const categoriesPath = path.join(__dirname, 'data/items.json');

  return new Promise((resolve, reject) => {
    fs.readFile(itemsPath, 'utf8', (err, data) => {
      if (err) {
        reject('unable to read items.json');
        return;
      };
      try {
        items = JSON.parse(data);
      } catch (err) {
        reject('Error parsing items.json');
        return;
      }

        fs.readFile(categoriesPath, 'utf8', (err, data) => {
          if (err) {
            reject('unable to read categories.json');
            return;
          };
          try {
            categories = JSON.parse(data);
          } catch (err) {
            reject('Error parsing categories.json');
            return;
          }
          resolve();
        });
    });
  })
}

module.exports.getAllItems = function() {
  return new Promise((resolve, reject) => {
    items.length == 0 ? reject('no results returned') : resolve(items);
  });
}

module.exports.getPublishedItems = function() {
  const publishedItems = items.filter((obj) => obj.published);
  return new Promise((resolve, reject) => {
    publishedItems.length == 0 ? reject('now results returned') : resolve(publishedItems);
  })
}