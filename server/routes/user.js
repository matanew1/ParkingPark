// user.js
import express from "express";
import UserController from "../controllers/user.js";

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

export default router;