const Sequelize = require('sequelize');

let sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', '7BDIwiSykM9b', {
  host: 'ep-super-dream-a5hb2oj6.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectoptions: {
    ssl: { rejectunauthorized: false }
  },
  query: { raw: true }
});

const Item = sequelize.define('Item', {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
  price: Sequelize.DOUBLE,
});

const Category = sequelize.define('Category', {
  category: Sequelize.STRING,
});

Item.belongsTo(Category, { FOREIGNKEYS: 'category' });

module.exports.initialize = function() {
  return new Promise((resolve, reject) => {
    sequelize.sync()
      .then(resolve())
      .catch(error => reject("Unable to sync the database"));
  })
}

module.exports.getAllItems = function() {
  return new Promise((resolve, reject) => {
    reject();
  });
}

module.exports.getPublishedItemsByCategory = function(category) {
  return new Promise((resolve, reject) => {
    reject();
  })
}

module.exports.getPublishedItems = function() {
  return new Promise((resolve, reject) => {
    reject();
  })
}

module.exports.getCategories = function() {
  return new Promise((resolve, reject) => {
    reject();
  })
}

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  // Months are zero-based in JavaScript, so add 1 and pad with '0' if needed
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

module.exports.addItem = function(itemData) {
  return new Promise((resolve, reject) => {
    reject();
  });
}

module.exports.getItemByCategory = function(category) {
  return new Promise((resolve, reject) => {
    reject();
  })
}

module.exports.getItemByMinDate = function(minDateStr) {
  return new Promise((resolve, reject) => {
    reject();
  })
}

module.exports.getItemById = function(id) {
  return new Promise((resolve, reject) => {
    reject();
  })
}
