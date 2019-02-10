// NOTE:  Schema is what we use to tell Mongoose about the particular fields our model will have
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our Model - references to 'String' are to the JS data type String.
// We are validating unique email addresses by forcing them lowercase and requiring them to be unique (mongoose would normally treat example & EXAMPLE as unique)
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
})

// Create the Model Class
// NOTE: this loads the schema into mongoose & tells it there is a new user class
const ModelClass = mongoose.model('user', userSchema);


// Export the Model - so other files in our app can use it
module.exports = ModelClass;
