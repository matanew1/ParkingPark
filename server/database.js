const mongoose = require("mongoose");

// Connect to MongoDB
async function connectToMongoDB(mongoURI) {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

// Retrieve the MongoDB connection URI from the configuration
const mongoURI = "mongodb+srv://matan:matan@cluster0.bgo3pus.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Establish the connection to MongoDB
connectToMongoDB(mongoURI);

// Set the strictPopulate option globally for Mongoose
mongoose.set("strictPopulate", false);

module.exports = mongoose;
