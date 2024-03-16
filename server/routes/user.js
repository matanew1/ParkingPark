const express = require("express");
const UserController =  require("../controllers/user.js");

const router = express.Router();
const userController = new UserController();

/**
 * @swagger
 * /api/admin/user:
 *  get:
 *    description: ADMIN - Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad Request. The request could not be understood or was missing required parameters.
 *      '401':
 *        description: Unauthorized. User authentication required.
 *      '403':
 *        description: Forbidden. User does not have permission to access this endpoint.
 *      '500':
 *        description: Internal Server Error. An error occurred on the server.
 */
router.get("/admin/user", userController.getAllUsers);


module.exports = router;