// NOTE:  Schema is what we use to tell Mongoose about the particular fields our model will have
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs')

// Define our Model - references to 'String' are to the JS data type String.
// We are validating unique email addresses by forcing them lowercase and requiring them to be unique (mongoose would normally treat example & EXAMPLE as unique)
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
})

// on Save Hook, encrypt the password
// Before saving a model, run this function
userSchema.pre('save', function(next){
  // get access to the user model -> 'user' is an instance of the user model that has an email and password
  const user = this;

  // generate a salt (takes some non-zero time) so we pass a CB function that will run after the salt has been created
  // NOTE: a salt is a randomly generated string of characters
  bcrypt.genSalt(10, function(err, salt){
    if(err){ return next(err) }

    // hash/encrypt our password using the salt (takes some non-zero time) so we pass a CB function that will run after password has been hashed
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err){ return next(err) }

      // overwrite plain text password with encrypted password
      // NOTE: the password we are saving has the SALT + HASHED PW -> important to note when a user signs in
      user.password = hash;
      // now save the model with the encrypted password
      next();
    });
  });
});

// Compare Passwords
userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err){ return callback(err) }
    callback(null, isMatch)
  })
}

// Create the Model Class
// NOTE: this loads the schema into mongoose & tells it there is a new user class
const ModelClass = mongoose.model('user', userSchema);


// Export the Model - so other files in our app can use it
module.exports = ModelClass;
