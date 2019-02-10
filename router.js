// export statement in a node.js environment
module.exports = function(app){
  // add route handlers to express
  // we are writing a 'get' request -> 1st arg is the route and the 2nd is a CB function when that route gets called
  // that CB function has 3 args -> req (request) an obj that represents the incoming HTTP request, res (response) an obj that we send back to whoever made the request, and next is for error handling
  app.get('/', function(req, res, next){
    res.send(['hi', 'hello', 'hey'])
  })
}
