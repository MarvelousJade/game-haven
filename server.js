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
  storeService.getAllItems()
  .then((data) => {
    res.send(data);
  })
  .catch((err) => console.log(`{message: ${err}}`));
});

app.get('/items', (req, res) => {
  storeService.getPublishedItems()
  .then((data) => {
    res.send(data);
  })
  .catch((err) => console.log(`{message: ${err}}`));
});

app.get('/categories', (req, res) => {
  storeService.getCategories()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => console.log(`{message: ${err}}`));
  });

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views/404.html'));
})

storeService.initialize()
  .then(
    app.listen(HTTP_PORT, () => console.log(`Express http server listening on ${HTTP_PORT}`)) 
  )
  .catch((err) => console.log(err));

