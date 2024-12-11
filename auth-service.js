const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: { type: String, unique: true, require: true },
  password: { type: String, require: true },
  email: { type: String, require: true },
  loginHistory: [{
    dateTime: { type: Date, require: true },
    userAgent: { type: String, require: true }
  }]
});

let User;

module.exports.initialize = function() {
  return new Promise(function(resolve, reject) {
    let db = mongoose.createConnection("mongodb+srv://shaoyu:CjLLgtHfsUTZWXnF@cluster0.nxmdk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

    db.on('error', (err) => {
      reject(err); // reject the promise with the provided error
    });
    db.once('open', () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = function(userData) {
  return new Promise((resolve, reject) => {
    if (userData.password !== userData.password2) {
      reject('Password do not match');
    } else {

      let newUser = new User(userData);

      newUser
        .save()
        .then(resolve)
        .catch((err) => {
          if (err.code === 11000) {
            reject('User Name already taken');
          } else {
            reject('There was an error creating the user: ', err);
          }
        });

    };
  });
};


module.exports.checkUser = function(userData) {
  return new Promise((resolve, reject) => {
    User.find({ userName: userData.userName }, function(err, users) {
      if (err) {
        reject(`There was an error verifying the user: ${err}`);
        return;
      };

      if (!users || users.length === 0) {
        reject('Unable to find user: ', userData.userName);
        return;
      };

      if (users[0].password !== userData.password) {
        reject('Incorrect Password for user: ', userData.userName);
        return;
      };

      if (users[0].password === userData.password) {
        users[0].loginHistory.push({
          dateTime: (new Date()).toString(),
          userAgent: userData.userAgent
        });
      };

      User.updateOne(
        { userName: users[0].userName },
        { $set: { loginHistory: users[0].loginHistory } },
        function(err, result) {
          if (err) {
            reject(`There was an error verifying the user: ${err}`);
            return;
          }

          if (result.nModified === 1 || result.modifiedCount === 1) {
            resolve(users[0]);
          } else {
            reject(`There was an error verifying the user: No documents were updated.`);
          }
        }
      );
    });
  });
};


