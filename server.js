/*********************************************************************************

WEB322 – Assignment 05
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Shaoyu Fan
Student ID: 125988238 
Date: 12/06/2024
Render Web App URL: https://web322-app-5d7z.onrender.com
GitHub Repository URL: https://github.com/MarvelousJade/web322-app

********************************************************************************/

const path = require('path');
const express = require('express'); // "require" the Express module
const storeService = require('./store-service');
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const exphbs = require('express-handlebars');
const { equal } = require('assert');
const helpers = require('./helpers');
const { resolve } = require('dns');
const authData = require("./store-service");
const clientSessions = require('client-sessions');

cloudinary.config({
  cloud_name: 'drgolqrkr',
  api_key: '437251579173388',
  api_secret: 'DkXsDC_L263_JqGObb4tua7T5Ts',
  secure: true
});

const upload = multer();
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  helpers: helpers,
}))
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


app.use(function(req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

app.use(
  clientSessions({
    cookieName: 'session',
    secret: 'feioIOJI&*^y983hjkdsfsAd',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  })
);

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
};

app.get('/', (req, res) => {
  res.redirect('/shop');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/items/add', ensureLogin, async (req, res) => {
  try {
    const categories = await storeService.getCategories();
    const plainCategories = categories.map(item => item.get({ plain: true }));
    res.render('addItem', { categories: plainCategories });
  } catch {
    res.render('addItem', { categories: [] });
  };
});


app.get("/shop", ensureLogin, async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};

  try {
    // declare empty array to hold "item" objects
    let items = [];

    // if there's a "category" query, filter the returned items by category
    if (req.query.category) {
      // Obtain the published "item" by category
      items = await storeService.getPublishedItemsByCategory(req.query.category);
    } else {
      // Obtain the published "items"
      items = await storeService.getPublishedItems();
    }

    const plainItems = items.map(item => item.get({ plain: true }));

    // sort the published items by itemDate
    plainItems.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

    // get the latest item from the front of the list (element 0)
    let item = plainItems[0];

    // store the "items" and "item" data in the viewData object (to be passed to the view)
    viewData.items = plainItems;
    viewData.item = item;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories = await storeService.getCategories();

    const plainCategories = categories.map(category => category.get({ plain: true }));

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = plainCategories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  // render the "shop" view with all of the data (viewData)
  res.render("shop", { data: viewData });
});


app.get('/shop/:id', ensureLogin, async (req, res) => {

  // Declare an object to store properties for the view
  let viewData = {};

  try {

    // declare empty array to hold "item" objects
    let items = [];

    // if there's a "category" query, filter the returned items by category
    if (req.query.category) {
      // Obtain the published "items" by category
      items = await storeService.getPublishedItemsByCategory(req.query.category);
    } else {
      // Obtain the published "items"
      items = await storeService.getPublishedItems();
    }

    const plainItems = items.map(item => item.get({ plain: true }));

    // sort the published items by postDate
    plainItems.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

    // store the "items" and "item" data in the viewData object (to be passed to the view)
    viewData.items = plainItems;

  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the item by "id"
    item = await storeService.getItemById(req.params.id);
    if (item) {
      // Convert Sequelize model instance to plain object
      const plainItem = item.get({ plain: true });

      // Handle price field
      if (isNaN(plainItem.price) || plainItem.price === null) {
        plainItem.price = "N/A";
      }

      viewData.item = plainItem;
    }
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories = await storeService.getCategories();

    const plainCategories = categories.map(category => category.get({ plain: true }));

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = plainCategories;
  } catch (err) {
    viewData.categoriesMessage = "no results"
  }

  // render the "shop" view with all of the data (viewData)
  res.render("shop", { data: viewData })
});

app.get('/items', ensureLogin, async (req, res) => {
  const { category, minDate } = req.query;
  try {
    let data;
    if (category) {
      data = await storeService.getItemByCategory(category);
    } else if (minDate) {
      data = await storeService.getItemsByMinDate(minDate);
    } else {
      data = await storeService.getPublishedItems();
    }

    // Convert Sequelize model instances to plain objects
    const plainData = data.map(item => item.get({ plain: true }));

    if (plainData && plainData.length > 0) {
      res.render('items', { data: plainData });
    } else {
      res.render('items', { message: "no results" });
    }
  } catch (err) {
    logger.error("Error in /items route:", err);
    res.render('items', { message: "An error occurred while fetching items." });
  }
});

app.get('/items/:id', ensureLogin, (req, res) => {
  const { id } = req.params;

  storeService.getItemById(id)
    .then((data) => {
      if (data.length > 0) {
        res.render('items', {
          data: data,
        });
      } else {
        res.render('items', {
          message: "no results",
        });
      }
    })
    .catch((err) => console.log(`{message: ${err}}`));
});

app.get('/categories', ensureLogin, (req, res) => {
  storeService.getCategories()
    .then((data) => {
      const plainData = data.map(item => item.get({ plain: true }));
      if (data.length > 0) {
        res.render('categories', {
          data: plainData,
        });
      } else {
        res.render('categories', {
          message: "no results",
        });
      }
    })
    .catch((err) => res.render('categories', { data: err }));
});

app.post('/items/add', ensureLogin, upload.single("featureImage"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded) => {
      processItem(uploaded.url);
    });
  } else {
    processItem("");
  };

  async function processItem(imageUrl) {
    try {
      req.body.featureImage = imageUrl;

      // TODO: Process the req.body and add it as a new Item before redirecting to /items
      const newItem = await storeService.addItem(req.body)
      console.log('New Item Added: ', newItem);
      res.redirect('/items');

    } catch (err) {
      console.error('Error Adding Item; ', err)
      res.status(500).send("Failed to add the item. Please try again.");
    };
  }
})

app.get('/items/delete/:id', ensureLogin, async (req, res) => {
  const { id } = req.params;
  try {
    await storeService.deleteItemById(id);
    res.redirect('/items');
  } catch (error) {
    console.log('In deleting item: ', error);
    res.status(500).send('Unable to Remove Item');
  };
})

app.get('/categories/add', ensureLogin, (req, res) => {
  res.render('addCategory');
})

app.post('/categories/add', ensureLogin, async (req, res) => {
  try {
    const newCategory = await storeService.addCategory(req.body)
    console.log('New Category Added: ', newCategory);
    res.redirect('/categories');

  } catch (err) {
    console.error('Error Adding Category; ', err)
    res.status(500).send("Failed to add the Category. Please try again.");
  };
})

app.get('/categories/delete/:id', ensureLogin, async (req, res) => {
  const { id } = req.params;
  try {
    await storeService.deleteCategoryById(id);
    res.redirect('/categories');
  } catch (error) {
    console.log('In deleting category: ', error);
    res.status(500).send('Unable to Remove Category');
  };
})

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views/404.html'));
})

storeService.initialize()
  .then(authData.initialize())
  .then(
    app.listen(HTTP_PORT, () => console.log(`Express http server listening on ${HTTP_PORT}`))
  )
  .catch((err) => console.log(`unable to start server ${err}`));

