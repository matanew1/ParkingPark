const admin = require("../firebase/admin");

class UserService {
    #admin; // private field

    constructor() {
        this.#admin = admin;
    }

    getAllUsers = async () => {
        try {
            const userRecords = await this.#admin.auth().listUsers();
            return userRecords.users.map(user => user.toJSON());
        } catch (error) {
            console.error('Error listing users:', error);
            throw error;
        }
    }
}

module.exports = UserService;