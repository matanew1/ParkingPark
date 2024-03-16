const admin = require("../firebase/admin");

class UserService {
    #admin; // private field

    constructor() {
        this.#admin = admin;
    }

    getAllUsers() {
        return this.#admin.auth().listUsers()
            .then((userRecords) => {
                return userRecords.users.map(user => user.toJSON());
            })
            .catch((error) => {
                console.error('Error listing users:', error);
                throw error;
            });
    }
}

module.exports = UserService;