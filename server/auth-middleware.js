const admin = require("firebase-admin");
const serviceAccount = require("./secret.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(403).send("No token provided");
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).send("Unauthorized");
  }
};

module.exports = verifyToken;
