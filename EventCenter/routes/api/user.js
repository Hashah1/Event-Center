/*
user.js -> 
Contains routes for the users database
*/
var passport = require('passport');
var settings = require('../../config/settings');
require('../../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../../models/user");


///////////////////////////////////////////
// Responsible for creating/registering
// new users
///////////////////////////////////////////
router.post('/register', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

///////////////////////////////////////////
// Responsible for logging 
// customers into the DB
///////////////////////////////////////////
router.post('/login', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), settings.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

///////////////////////////////////////////
// Returns list of all users in DB
///////////////////////////////////////////
router.get('/', (req,res) => {
  const query = req.query;
// query every forms in our db
User.find(query)
.then(forms => {
  // return json response
  res.json({
    confirmation: 'Successful',
    data: forms
  })
})
.catch(err => {
  res.json({
    confirmation: 'Unsuccessful',
    message: err.message
  })
})});

module.exports = router;


