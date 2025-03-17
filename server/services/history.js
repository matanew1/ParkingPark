import axios from 'axios';
import { createLogger } from '../utils/logger.js';
import config from '../utils/configs.js';
import NodeCache from 'node-cache';
import OperationModel from '../models/operation.js';
import { get } from 'mongoose';

const logger = createLogger('ParkingService');


class HistoryOperationService {
    #axios;
    #historyCache;
    #cache;

    constructor() {
        // Initialize axios with config
        this.#axios = axios.create({
            baseURL: config.apis.parking.baseUrl,
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        // Add response interceptor for error handling
        this.#axios.interceptors.request.use(
            config => {
                logger.debug(`Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, {
                    headers: config.headers
                });
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        this.#historyCache = [];
        this.#cache = new NodeCache({
            stdTTL: 600,
            checkperiod: 120,
            useClones: false
        });


    }

    async addHistoryOperation(data) {
        try {

            const operation = new OperationModel(data);
            await operation.save().then((result) => {
                logger.info('History operation added', result);
            });
        } catch (error) {
            logger.error('Error adding history operation', error);
            throw error;
        }
    }

    async getAllHistoryOperation() {
        try {
            // Use cached history if available
            if (this.#historyCache.length > 0 && this.#cache.get('stations_data')) {
                logger.debug('Returning cached history data');
                return this.#historyCache;
            }

            logger.info('Fetching all history from DB');
            const data = await OperationModel.find({}).sort({ createdAt: -1 });

            // Process history data
            this.#historyCache = data.map((item) => {
                return {
                    id: item._id,
                    endpoint: item.endpoint,
                    status: item.status,
                    message: item.message,
                    createdAt: new Date(item.createdAt).toLocaleString(), // formatted as "MM/DD/YYYY, HH:MM:SS AM/PM"
                    updatedAt: new Date(item.updatedAt).toLocaleString() // formatted as "MM/DD/YYYY, HH:MM:SS AM/PM"
                };
            });

            return this.#historyCache;

        }
        catch (error) {
            logger.error(`Error fetching data from DB`, { error: error.message });
            throw new Error(`Failed to fetch data: ${error.message}`);
        }
    }

    async deleteAllHistoryOperation() {
        try {
            logger.info('Deleting all history from DB');
            await OperationModel.deleteMany({});
            return true;
        } catch (error) {
            logger.error(`Error deleting data from DB`, { error: error.message });
            throw new Error(`Failed to delete data: ${error.message}`);
        }
    }
}

export default HistoryOperationService;