const admin = require("firebase-admin");
const serviceAccount = require("./credentials.json");

class FirebaseAdmin {
  #adminInstance;

  constructor() {
    this.#adminInstance = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  getAdmin() {
    return this.#adminInstance;
  }
}

module.exports = new FirebaseAdmin().getAdmin();