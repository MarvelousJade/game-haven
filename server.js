const path = require('path');
const express = require('express'); // "require" the Express module
const storeService = require('./store-service');
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/about');
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/shop', (req, res) => {
  res.send(`TODO: get all items who have published==true`);
});

app.get('/items', (req, res) => {
  res.send(`TODO: get all the items within the items.json file`);
});

app.get('/categories', (req, res) => {
  res.send(`TODO: get all the categories within the categories.json file`);
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views/404.html'));
})

storeService.initialize()
  .then(() => {
    console.log(storeService.getPublishedItems());
  })

app.listen(HTTP_PORT, () => console.log(`Express http server listening on ${HTTP_PORT}`)); 

