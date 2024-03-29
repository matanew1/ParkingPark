// index.js
const express = require("express");

// Import custom modules
const verifyToken = require("./firebase/auth-middleware");
const User = require("./models/user.js");
const userRouter = require("./routes/user");
const parkingRouter = require("./routes/parking");
const setupSwagger = require("./middlewares/swagger");
const setupMiddleware = require("./middlewares/middleware");

// Initialize Express app
const app = express();

// Middleware setup
setupMiddleware(app);

// Swagger setup
setupSwagger(app);

// Route setup
app.use("/api/user", userRouter);
app.use("/api/parking", parkingRouter);

// Start server
app.listen(4000, () => console.log("The server is running at PORT 4000"));