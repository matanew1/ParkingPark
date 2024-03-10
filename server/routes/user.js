const express = require("express");
const UserController =  require("../controllers/user.js");

const router = express.Router();
const userController = new UserController();

router.get("/user", userController.getAllUsers);


module.exports = router;