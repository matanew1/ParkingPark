const admin = require("./admin");

class AuthMiddleware {
  #admin;

  constructor() {
    this.#admin = admin;
  }

  verifyToken = async (req, res, next) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(403).send("No token provided");
      }

      const decodedToken = await this.#admin.auth().verifyIdToken(token);
      req.user = decodedToken;

      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).send("Unauthorized");
    }
  }
}

module.exports = new AuthMiddleware().verifyToken;