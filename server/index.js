const express = require("express");
const cors = require("cors");
const verifyToken = require("./auth-middleware");
const User = require("./user.js");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/login", verifyToken, async (req, res) => {
  try {
    // If the token is verified, you can access the user information from req.user
    console.log("Authentication successful, logging in...");

    // Find the user in the database based on the user's name
    const existingUser = await User.findOne({ email: req.user.email });

    if (existingUser) {
      // If the user exists, update the lastLogin field
      existingUser.lastLogin = new Date();
      existingUser.isLoggedIn = true;
      await existingUser.save();
    } else {
      // If the user does not exist, create a new user
      const newUser = new User({
        email: req.user.email,
        isLoggedIn: true,
        lastLogin: new Date()
      });
      await newUser.save();
    }

    res.send(req.user.email);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/logout", async (req, res) => {
  try {
    // Extract userId from query parameters
    const email = req.query.email;

    // Here you can update user status or perform any cleanup tasks in your database
    console.log(`User with ID ${email} logged out`);

    var existingUser = await User.findOne({ email: email });
    existingUser.isLoggedIn = false;
    await existingUser.save();

    // Respond with a success message
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error handling logout request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(4000, () => console.log("The server is running at PORT 4000"));
