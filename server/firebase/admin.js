// admin.js
import admin from "firebase-admin.js";
import serviceAccount from './credentials.json' assert { type: 'json' };

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

export default new FirebaseAdmin().getAdmin();