const mongoose = require("mongoose");
require('dotenv').config();

class Database {
  #mongoose;
  #mongoURI;

  constructor() {
    this.#mongoose = mongoose;
    this.#mongoose.set("strictPopulate", false);
    this.#mongoURI = process.env.MONGO_URI;
  }

  async connectToMongoDB() {
    try {
      await this.#mongoose.connect(this.#mongoURI);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
    }
  }

  get mongoose() {
    return this.#mongoose;
  }
}

const db = new Database();
db.connectToMongoDB();

module.exports = db;