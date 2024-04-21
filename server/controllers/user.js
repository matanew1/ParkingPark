// user.js
import UserService from "../services/user.js";

class UserController {
    #userService;

    constructor() {
        this.#userService = new UserService();
    }

    getAllUsers = async (req, res) => {
        try {
            const users = await this.#userService.getAllUsers();
            if (users.length > 0) {
                res.status(200).json(users);
            } else {
                res.status(404).json({ message: "No users found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default UserController;