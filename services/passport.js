// This file will hold configuration for Passport -> will help us authenticate a user when they attempt to visit a route that require authentication
// NOTE: In Passport, a Strategy is a method that will attempt to authenticate a user (we imported the Strategy specifically for validating a JWT)
const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


// Create Separate Local Strategy for a User Logging In -> separate goal from JWT token strategy of verifying whether a username / password has been used. Here we are verifying correctly logged in info
const localOptions = { usernameField: 'email' } // LocalStrategy expects to get a username and password -> since we have an email instead of a username we specify to look at email
const localLogin = new LocalStrategy({ localOptions }, function(email, password, done){
  // Verify this username and password
  User.fundOne({ email: email }, function(err, user){
    if(err){ return done(err, false) }
    if(!user){ done(null, user) }
    // compare passwords between what the user entered and what was saved in the DB
    // NOTE: the saved PW in the DB is the SALT + Hashed PW. We take the salt (encryption key) and use it to encrpyt the submitted password the user typed in
    // NOTE: that will return a Hashed PW -> that we then compare to the DB saved Hashed PW
    // NOTE: AT NO POINT ARE WE DECYPTING PASSWORDS
    user.comparePassword(password, function(err, isMatch){
      if(err){ return done(err) }
      if(!isMatch){ return done(null, false) }

      return done(null, user) // this 'done' CB supplied by passport assigns this to req.user so we can make use of it in 'controllers/authentication.js'
    })
  })
})


// Setup options for JWT Strategy
// NOTE: JWT tokens can sit in a body, header, URL or really anywhere -> so we need to be specific about where Passport should look to find the token
// NOTE: JWT Strategy also needs to know the secret so it can decode
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};


// Create JWT Strategy - 1st arg is the options and 2nd arg is a CB that will get called whenever a user needs to be authenticated with a jwt
// NOTE: payload is the jwt.encode({ sub: user.id, iat: timestamp } obj from 'controllers/authentication.js'
// NOTE: 'done' is a CB that we will call
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  // Check to see if the UserID in the payload exists in our DB
  // If it does, then call 'done' with that obj
  // If it doesn't, call 'done' without a user obj
  User.findById(payload.sub, function(err, user){
    if(err){ return done(err, false) } // we haven't found a user in our DB
    if(user){ done(null, user) }
    else{ done(null, false) }
  });
});


// Tell Passport to Use This Strategy
passport.use(jwtLogin);
passport.use(localLogin);
