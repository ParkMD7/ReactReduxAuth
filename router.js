const Authentication = require('./controllers/authentication')


module.exports = function(app){
  // add route handlers to express
  app.post('/signup', Authentication.signup);
}


// NOTE: when writing route functions, 1st arg is the route and the 2nd is a CB function when that route gets called
// NOTE: that CB function has 3 args -> req (request) an obj that represents the incoming HTTP request, res (response) an obj that we send back to whoever made the request, and next is for error handling
