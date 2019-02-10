const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// by default, passport wants to create a cookie based session for this request -> so we turn it off with false since we're using JWT tokens
const requireAuth = passport.authenticate('jwt', {session: false })

module.exports = function(app){
  // add route handlers to express
  app.get('/', requireAuth, function(req, res){
    res.send({ hi: 'there' })
  })

  app.post('/signup', Authentication.signup);
}


// NOTE: when writing route functions, 1st arg is the route and the 2nd is a CB function when that route gets called
// NOTE: that CB function has 3 args -> req (request) an obj that represents the incoming HTTP request, res (response) an obj that we send back to whoever made the request, and next is for error handling
