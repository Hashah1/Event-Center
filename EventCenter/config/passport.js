const mongoose = require('mongoose');
//const passport = require('passport');
//const LocalStrategy = require('passport-local');

// passport.use(new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password'
// }, (email, password,  done) => {
//   console.log("Passport with email = " + email + " pass = " + password);
//   User.findOne({ email })
//     .then((user) => {
//       console.log("Got user from db: ");
//       console.dir(user);
//       console.log("Password = " + password);
//       let isValid = user.validatePassword(password);
//       console.log("is valid? = " + isValid);
//       if(!user || !isValid ) {
//         return done(null, false, { errors: { 'email or password': 'is invalid' } });
//       }

//       return done(null, user);
//     }).catch(done);
// }));
var User = mongoose.model('User');

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var settings = require('./settings'); // get settings file


module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = settings.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};