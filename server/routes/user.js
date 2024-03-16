// user.js
const express = require("express");
const UserController =  require("../controllers/user.js");

const router = express.Router();
const userController = new UserController();

/**
 * @openapi
 * /api/user:
 *   get:
 *     description: Use to request all users
 *     responses:
 *       '200':
 *         description: A successful response
 */
router.get("/", userController.getAllUsers);

module.exports = router;