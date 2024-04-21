// middleware.js
import cors from "cors";
import express from "express";
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const setupMiddleware = (app) => {
  app.use(cors()); //  apply to all requests
  app.use(express.json()); //  apply to all requests
  app.use(compression()); //  apply to all requests
  app.use(helmet()); //  apply to all requests
  app.use(limiter); //  apply to all requests
};

export default setupMiddleware;