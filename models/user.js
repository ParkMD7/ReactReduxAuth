const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our Model - references to 'String' are to the JS data type String & we are validating unique email addresses
const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String
})

// Create the Model Class


// Export the Model
