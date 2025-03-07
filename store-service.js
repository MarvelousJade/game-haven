const Sequelize = require('sequelize');
const config = require('./config');

let sequelize = new Sequelize(
  config.PG.database,
  config.PG.user,
  config.PG.password,
  {
    host: config.PG.host,
    dialect: config.PG.dialect,
    port: config.PG.port,
    dialectOptions: config.PG.dialectOptions,
    //query: { raw: true }
  }
);

const Category = sequelize.define('Category', {
  category: Sequelize.STRING,
});

const Item = sequelize.define('Item', {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  categoryId: {
    type: Sequelize.INTEGER,
    references: {
      model: Category,
      key: 'id',
    },
  },
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
  price: Sequelize.DOUBLE,
});

Item.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Item, { foreignKey: 'categoryId' });

module.exports.initialize = async function() {
  try {
    await sequelize.sync();
    console.log("Database synced successfully");
  } catch (error) {
    throw new Error("Unable to sync the database" + error.message);
  }
}

module.exports.getAllItems = async function() {
  try {
    const items = await Item.findAll({ include: Category });
    return items;
  } catch (error) {
    throw new Error("no results returned");
  }
}

module.exports.getPublishedItemsByCategory = async function(categoryId) {
  try {
    const items = await Item.findAll({
      where: {
        published: true,
        categoryId: categoryId,
      },
      include: Category,
    })
    return items;
  } catch (error) {
    console.log("no resuls returned");
  }
}

module.exports.getPublishedItems = async function() {
  try {
    const items = await Item.findAll({
      where: {
        published: true
      },
      include: Category,
    })
    return items;
  } catch (error) {
    throw new Error("Error fetching published items: " + error.message);
  }
}

module.exports.getCategories = async function() {
  try {
    const categories = await Category.findAll();
    return categories;
  } catch (error) {
    console.log("no results turned");
  }
}

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  // Months are zero-based in JavaScript, so add 1 and pad with '0' if needed
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

module.exports.addItem = async function(itemData) {
  try {
    itemData.published = (itemData.published) ? true : false;
    for (const key in itemData) {
      if (itemData[key] === "") itemData[key] = null;
    };
    itemData.postDate = new Date();

    const item = await Item.create({
      body: itemData.body,
      title: itemData.title,
      postDate: itemData.postDate,
      categoryId: itemData.categoryId,
      featureImage: itemData.featureImage,
      published: itemData.published,
      price: itemData.price,
    });
    return item;
  } catch (error) {
    throw new Error("Unable to create post" + error.message);
  }
}

module.exports.getItemByCategory = async function(categoryId) {
  try {
    const items = await Item.findAll({
      where: {
        categoryId: categoryId,
      },
    });
    return items;
  } catch (error) {
    throw new Error("no results returned");
  }
}

module.exports.getItemsByMinDate = async function(minDateStr) {
  try {
    const { gte } = Sequelize.Op;
    const items = await Item.findAll({
      where: {
        postDate: {
          [gte]: new Date(minDateStr)
        }
      }
    });
    return items;
  } catch (error) {
    throw new Error("no results returned");
  }
}


module.exports.getItemById = async function(id) {
  // Validate that id is a positive integer
  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    throw new Error("Invalid item ID");
  }

  try {
    const item = await Item.findOne({
      where: {
        id: id
      },
      include: {
        model: Category,
        attributes: ['id', 'category']
      },
      raw: false // Set to true if you prefer plain objects
    });

    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }

    return item; // Returns a Sequelize instance or plain object based on 'raw'
  } catch (error) {
    throw error; // Re-throw the error for upstream handling
  }
}


module.exports.deleteItemById = async function(id) {
  try {
    const items = await Item.destroy({
      where: { id: id },
    })
    return items;
  } catch (error) {
    throw new Error("unable to delete item");
  }
}
module.exports.addCategory = async function(categoryData) {
  for (const key in categoryData) {
    if (categoryData[key] === "") categoryData[key] = null;
  };
  try {
    const category = await Category.create({
      category: categoryData.category,
    });
    return category;
  } catch (error) {
    throw new Error("unable to create category");
  };
}

module.exports.deleteCategoryById = async function(id) {
  try {
    const category = await Category.destroy({
      where: { id: id },
    });
    return category;
  } catch (error) {
    console.log("In delete function. ", error);
    throw new Error("unable to delete category");
  };
}
