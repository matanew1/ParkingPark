// index.js
const express = require("express");

// model ai
const {
  decisionMakerByText,
  translateText,
  loadModel,
  loadTranslator,
  loadDecisionMaker,
} = require("./AIModel/model");

// Load the model and translator
loadModel().then(() => {
  loadTranslator();
  loadDecisionMaker();
});

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

// AI model routes
/**
 * {
    "text": "תעריף לכניסה חד פעמית 24 ₪, תקף ל-24 שעות מרגע כניסת הרכב"
}
 */
app.post("/api/ai/translate", async (req, res) => {
  const text = req.body.text;
  const result = await translateText(text);
  console.log(result);
  res.send(result);
});

/**{
    "text": "Prompt: Which parking option is preferable?
    \n1. Entry fee: NIS 24, valid for 24 hours.
    \n2. Entry fee: NIS 24, valid for 24 hours. Early exit within 15 minutes refunds fee."
} */
app.post("/api/ai/decisionMaker", async (req, res) => {
  const text = req.body.text;
  const result = await decisionMakerByText(text);
  console.log(result); // Output the generated text
  res.send(result);
});

// Start server
app.listen(4000, () => console.log("The server is running at PORT 4000"));

// Path: server/routes/user.js
