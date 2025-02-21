const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const config = require('./config');

const userSchema = new Schema({
  userName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  loginHistory: [{
    dateTime: { type: Date, required: true },
    userAgent: { type: String, required: true }
  }]
});

let User;

module.exports.initialize = async function() {
  try {
    let db = mongoose.createConnection(config.MONGODB_URI);
    await new Promise((resolve, reject) => {
      db.on('error', reject);
      db.once('open', resolve);
    });
    User = db.model("users", userSchema);
  } catch (err) {
    throw new Error("Failed to connect to MongoDB: " + err.message);
  }
}

module.exports.registerUser = function(userData) {
  return new Promise((resolve, reject) => {
    // Check if passwords match
    if (userData.password !== userData.password2) {
      reject('Passwords do not match');
    } else {
      // Hash the password before saving
      bcrypt.hash(userData.password, 10) // 10 salt rounds
        .then(hashedPassword => {
          // Create a new user object with the hashed password
          let newUser = new User({
            userName: userData.userName,
            password: hashedPassword,
            email: userData.email,
            loginHistory: [] // Initialize empty login history
          });

          // Save the new user to the database
          newUser.save()
            .then(() => {
              resolve(); // Resolve the promise on successful save
            })
            .catch((err) => {
              if (err.code === 11000) { // Duplicate key error
                reject('User Name already taken');
              } else {
                reject('There was an error creating the user: ' + err);
              }
            });
        })
        .catch(err => {
          // Handle errors during password hashing
          reject('There was an error encrypting the password');
        });
    }
  });
};

module.exports.checkUser = function(userData) {
  return new Promise((resolve, reject) => {
    // Find the user by userName
    User.findOne({ userName: userData.userName })
      .then(user => {
        if (!user) {
          reject('Unable to find user: ' + userData.userName);
          return;
        }

        // Compare the entered password with the hashed password in the database
        bcrypt.compare(userData.password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              reject('Incorrect Password for user: ' + userData.userName);
              return;
            }

            // If password matches, update login history
            user.loginHistory.push({
              dateTime: new Date(),
              userAgent: userData.userAgent
            });

            // Save the updated user document
            user.save()
              .then(() => {
                resolve(user); // Resolve with the user object on success
              })
              .catch(err => {
                reject('There was an error verifying the user: ' + err);
              });
          })
          .catch(err => {
            reject('There was an error comparing passwords: ' + err);
          });
      })
      .catch(err => {
        reject('There was an error finding the user: ' + err);
      });
  });
};

