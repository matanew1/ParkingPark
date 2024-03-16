const db = require("./database.js");

class UserModel {
  #User;

  constructor() {
    this.#User = this.#defineSchema();
  }

  #defineSchema() {
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

    return db.mongoose.model("User", userSchema);
  }

  getModel() {
    return this.#User;
  }
}

module.exports = new UserModel().getModel();