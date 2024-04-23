// middleware.js
import cors from "cors"; // apply to all requests for Cross-Origin Resource Sharing (CORS) support
import express from "express"; // apply to all requests for parsing incoming request bodies
import compression from 'compression'; // apply to all requests for compressing responses with gzip/deflate
import helmet from 'helmet'; // apply to all requests for security headers and other security protections
import rateLimit from "express-rate-limit"; // apply to all requests to limit repeated requests to public APIs and/or endpoints

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const setupMiddleware = (app) => {
  app.use(cors()); // apply to all requests
  app.use(express.json()); // apply to all requests
  app.use(express.urlencoded({ extended: true })); // apply to all requests
  app.use(compression()); // apply to all requests
  app.use(helmet()); // apply to all requests for security headers and other security protections
  app.use(limiter); // apply to all requests
};

export default setupMiddleware;