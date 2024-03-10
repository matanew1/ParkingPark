const express = require("express");
const cors = require("cors");
const verifyToken = require("./firebase/auth-middleware");
const User = require("./models/user.js");
const userRouter = require("./routes/user");


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", userRouter);

app.listen(4000, () => console.log("The server is running at PORT 4000"));
