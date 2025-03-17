// config.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file in project root (going up one directory level)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Add debug logs
console.log('Environment variables loaded:', {
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: process.env.BASE_URL,
    MONGO_URI: process.env.MONGO_URI
});

const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000', 10),
    mongo: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/parking',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
    apis: {
        parking: {
            baseUrl: process.env.BASE_URL || 'https://api.tel-aviv.gov.il/parking'
        },
        translate: {
            rapidApiKey: process.env.RAPID_API_KEY,
            rapidApiHost: process.env.RAPID_API_HOST
        }
    },
    statuses: {
        Full: 'אלמ',
        Available: 'יונפ',
        AlmostFull: 'טעמ',
        CloseOrNotAvailable: 'רוגס',
    }
};

export default config;