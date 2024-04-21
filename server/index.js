// index.mjs
import express from "express";

// model ai
import {
  decisionMakerByText,
  translateText,
} from "./AIModel/model.js";

// Import custom modules
import verifyToken from "./firebase/auth-middleware.js";
import UserModel from "./models/user.js";
import userRouter from "./routes/user.js";
import parkingRouter from "./routes/parking.js";
import setupSwagger from "./middlewares/swagger.js";
import setupMiddleware from "./middlewares/middleware.js";

// Initialize Express app
const app = express();

// Middleware setup
setupMiddleware(app);

// Swagger setup
setupSwagger(app);

// Route setup
app.use("/api/user", userRouter);
app.use("/api/parking", parkingRouter);

// AI model routes
app.post("/api/ai/translate", async (req, res) => {
  const text = req.body.text;
  const result = await translateText(text);
  console.log(result);
  res.send(result);
});

app.post("/api/ai/decisionMaker", async (req, res) => {
  const text = req.body.text;
  const result = await decisionMakerByText(text);
  console.log(result); // Output the generated text
  res.send(result);
});


// Start server
const startServer = async () => {
 app.listen(4000, () => {
    console.log("The server is running at PORT 4000");
  });
};

startServer();
