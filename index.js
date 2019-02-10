// dependencies
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const router = require('./router');
const mongoose = require('mongoose');



// DB Setup NOTE: internally this creates a new db inside of mongodb named 'authentication'
mongoose.connect('mongodb://localhost:auth/authentication', {useNewUrlParser: true})


// App Setup NOTE: morgan and bodyParser are middlewares in express -> any incoming request into our server will be passed into both of these by default via app.use
const app = express(); // create instance of our app
app.use(morgan('combined')); // this is a logging framework that logs incoming requests and is used mostly for debugging
app.use(bodyParser.json({ type: '*/*' })); // this is used to parse incoming requests into JSON no matter what the request type is
router(app);


// Server Setup NOTE: nodemon will auto restart the server if we make any changes to the code
const port = process.env.PORT || 3000;
const server = http.createServer(app)
server.listen(port);
console.log('Server listening on:', port)
