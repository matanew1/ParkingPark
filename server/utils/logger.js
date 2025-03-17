// logger.js
import winston from 'winston';
import config from './configs.js';

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define log colors
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Create formatter
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(info => {
        const { timestamp, level, message, service, ...metadata } = info;
        const metadataString = Object.keys(metadata).length
            ? JSON.stringify(metadata)
            : '';

        return `[${timestamp}] [${service || 'app'}] [${level}]: ${message} ${metadataString}`;
    })
);

// Define different transports
const transports = [
    // Console transport
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({ all: true }),
            format
        ),
    }),

    // File transport for all logs
    new winston.transports.File({
        filename: 'logs/combined.log',
        format,
    }),

    // File transport for error logs
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format,
    }),
];

// Create logger factory
export const createLogger = (service) => {
    return winston.createLogger({
        level: config.env === 'development' ? 'debug' : 'info',
        levels,
        format,
        defaultMeta: { service },
        transports,
    });
};

// Create default logger
const logger = createLogger('app');

// Handle uncaught exceptions and unhandled rejections
logger.exceptions.handle(
    new winston.transports.File({ filename: 'logs/exceptions.log' })
);

logger.rejections.handle(
    new winston.transports.File({ filename: 'logs/rejections.log' })
);

// Export the logger
export default logger;