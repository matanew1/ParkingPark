const db = require("./database.js");

// Define a schema for the user model
const userSchema = new db.mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  isLoggedIn: {
    type: Boolean,
    required: true
  },
  lastLogin: {
    type: Date
  }
});

// Define a model for the user collection
const User = db.mongoose.model("User", userSchema);

module.exports = User;
