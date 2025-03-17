// errorHandler.js
import config from '../utils/configs.js';

// Custom error handler middleware
const errorHandler = (err, req, res, next) => {
    // Default error values
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error
    console.error(`❌ Error ${statusCode}: ${message}`);
    if (config.env === 'development') {
        console.error(err.stack);
    }

    // Send response based on environment
    res.status(statusCode).json({
        status: 'error',
        message,
        ...(config.env === 'development' && { stack: err.stack })
    });
};

export default errorHandler;