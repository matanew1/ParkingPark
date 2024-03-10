const User = require('../models/user');
const admin = require("../firebase/admin");

class UserService {
    getAllUsers() {
        return admin.auth().listUsers()
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

module.exports = UserService;