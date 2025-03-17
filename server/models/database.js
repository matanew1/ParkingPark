// database.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  console.log(`Loading environment from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.log('No .env file found, using environment variables');
  dotenv.config();
}

class Database {
  #mongoose;
  #mongoURI;

  constructor() {
    this.#mongoose = mongoose;
    this.#mongoose.set('strictQuery', false);

    // Get MongoDB URI from environment or use default
    this.#mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/parkingdb';
  }

  async connectToMongoDB() {
    try {
      await this.#mongoose.connect(this.#mongoURI);
      console.log('✅ Connected to MongoDB');

      // Handle connection events
      this.#mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      this.#mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
      });

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      // Don't exit - let the application handle the error
    }
  }

  get mongoose() {
    return this.#mongoose;
  }
}

const db = new Database();

export default db;