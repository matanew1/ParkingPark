// index.mjs
import express from "express";

// Import custom modules
import UserModel from "./models/user.js";
import userRouter from "./routes/user.js";
import parkingRouter from "./routes/parking.js";
import aiRouter from "./routes/ai.js";
import translateRouter from "./routes/translate.js";
import setupSwagger from "./middlewares/swagger.js";
import setupMiddleware from "./middlewares.js";

// Initialize Express app
const app = express();

// Middleware setup
setupMiddleware(app);

// Swagger setup
setupSwagger(app);

// Route setup
app.use("/api/user", userRouter);
app.use("/api/parking", parkingRouter);
app.use("/api/ai", aiRouter);
app.use("/api/translate", translateRouter);

// Start server
const startServer = async () => {
 app.listen(4000, () => {
    console.log("The server is running at PORT 4000");
  });
};

startServer();
