/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Shaoyu Fan
Student ID: 125988238 
Date: 10/7/2024
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

app.get('/', (req, res) => {
  res.redirect('/about');
  res.redirect('/shop');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/items/add', (req, res) => {
  res.render('addItem');
});


app.get("/shop", async (req, res) => {
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

    // sort the published items by itemDate
    items.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

    // get the latest item from the front of the list (element 0)
    let item = items[0];

    // store the "items" and "item" data in the viewData object (to be passed to the view)
    viewData.items = items;
    viewData.item = item;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories = await storeService.getCategories();

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  // render the "shop" view with all of the data (viewData)
  res.render("shop", { data: viewData });
});

app.get('/items', (req, res) => {
  const { category, minDate } = req.query;
  if (category) {
    storeService.getItemByCategory(category)
      .then((data) => {
        res.render('items', {
          data: data,
        });
      })
      .catch((err) => res.render('items', { data: err }));
  } else if (minDate) {
    storeService.getItemByMinDate(minDate)
      .then((data) => {
        res.render('items', {
          data: data,
        });
      })
      .catch((err) => res.render('items', { data: err }));
  } else {
    storeService.getPublishedItems()
      .then((data) => {
        res.render('items', {
          data: data,
        });
      })
      .catch((err) => res.render('items', { data: err }));
  }
});

app.get('/items/:id', (req, res) => {
  const { id } = req.params;

  storeService.getItemById(id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => console.log(`{message: ${err}}`));
});

app.get('/categories', (req, res) => {
  storeService.getCategories()
    .then((data) => {
      res.render('categories', {
        data: data,
      });
    })
    .catch((err) => res.render('categories', { data: err }));
});

app.post('/items/add', upload.single("featureImage"), (req, res) => {
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
  }

  function processItem(imageUrl) {
    req.body.featureImage = imageUrl;

    // TODO: Process the req.body and add it as a new Item before redirecting to /items
    storeService.addItem(req.body)
      .then((newItem) => {
        console.log('New Item Added: ', newItem);
        res.redirect('/items');
      })
      .catch((err) => {
        console.error('Error Adding Item; ', err)
        res.status(500).send("Failed to add the item. Please try again.");
      })
  }
})

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views/404.html'));
})

storeService.initialize()
  .then(
    app.listen(HTTP_PORT, () => console.log(`Express http server listening on ${HTTP_PORT}`))
  )
  .catch((err) => console.log(err));

