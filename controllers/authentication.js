const User = require('../models/user');
const jwt = require('jwt-simple')
const config = require('../config')

// Create a function that will take a user's ID and encode it with our secret
function tokenForUser(user){
  const timestamp = new Date().getTime();
  // first arg of encode is the info we want to encode (best to do something static like ID that wont change) and the 2nd is the secret we will use to encrypt it
  // NOTE: 'sub' key is short for subject (who does this token belong to)
  // NOTE: 'iat' key is short for issued at time (when was this token issued)
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secrets)
}

exports.signup = function(req, res, next){
  // Grab the email & password a user has entered -> req.body is the obj that will have this info
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    return res.status(422).send({ error: 'You Must Provide a Valid Email and Password' });
  }

  // Check to see if a user with the given email exists (FindOne user from the User class with an email that equals the 'email' variable)
  // 2nd arg is a CB function that will either throw an error or return existingUser
  User.findOne({ email: email }, function(err, existingUser) {
    if(err){ return next(err) }

    // If a user with that email exists - return an error
    if(existingUser){
      return res.status(422).send({ error: 'Email is Already in Use' }) // 422 = unprocessable entity -> given email already exists for a user
    }

    // If a user with that email does NOT exist, create and save user record
    // create user
    const user = new User({
      email: email,
      password: password
    })

    // save user to DB -> pass a CB so we know if the save has succeeded or failed
    user.save(function(err){
      if(err){ return next(err) }
      // Respond to request indicating the user was created -> we now consider them logged in and here is where we will pass a JWT to the user
      // NOTE: when a user is signing up or signing in, we give a JSON Web Token in exchange for a user ID
      // NOTE: in the future, if a user gives us a token for an authenticated request, we can decrypt it with our secret string
      res.json({ token: tokenForUser(user) });
    });
  });
}
