// middleware.js
import cors from "cors";
import express from "express";
import compression from 'compression';
import helmet from 'helmet';

const setupMiddleware = (app) => {
  app.set('trust proxy', 1); // Add this line
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());
  app.use(helmet());
};

export default setupMiddleware;