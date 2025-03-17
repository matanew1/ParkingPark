// index.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import routes
import parkingRouter from './routes/parking.js';
import translateRouter from './routes/translate.js';
import operationHistory from './routes/history.js';

// Import middleware
import swagger from './middlewares/swagger.js';
import middleware from './middlewares/middleware.js';

// Import database
import db from './models/database.js';

// Get the directory name in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables if not already loaded
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log(`Loading environment from ${envPath}`);
  dotenv.config({ path: envPath });
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Setup middleware
middleware(app);

// Setup swagger
swagger(app);

// Setup routes
app.use('/api/parking', parkingRouter);
app.use('/api/translate', translateRouter);
app.use('/api/history', operationHistory);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'ParkingPark API is running',
    version: '1.0.0',
    docs: '/api-docs'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await db.connectToMongoDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Start the server
startServer();

export default app;