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
cloudinary.config({
  api_key: '437251579173388',
  api_secret: 'DkXsDC_L263_JqGObb4tua7T5Ts',
  secure: true
});
const streamifier = require('streamifier');

const upload = multer();
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/about');
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/items/add', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/addItem.html'));
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

app.post('/items/add', upload.single("featureImage"), (req, res) => {
  if(req.file){
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

    upload(req).then((uploaded)=>{
        processItem(uploaded.url);
    });
}else{
    processItem("");
}
 
function processItem(imageUrl){
    req.body.featureImage = imageUrl;

    // TODO: Process the req.body and add it as a new Item before redirecting to /items
    storeService.addItem(req.body)
      .then((newItem) => {
        console.log('New Item Added: ', newItem);
        res.redirect('/items');
      })
      .catch((err) => {
        console.error('Error Adding Item; ', err)
        res.status(500).send("Faliled to add the item. Please try again.");
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

