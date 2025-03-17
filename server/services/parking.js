// parking.js (service)
import axios from 'axios';
import Station from '../models/station.js';
import { createLogger } from '../utils/logger.js';
import TranslateService from './translate.js';
import config from '../utils/configs.js';
import NodeCache from 'node-cache';
import HistoryOperationService from './history.js';
import operation from '../models/operation.js';

const logger = createLogger('ParkingService');

class ParkingService {
  #axios;
  #stations;
  #historyOperationService;
  #translateService;
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

    this.#stations = [];
    this.#translateService = new TranslateService();
    this.#historyOperationService = new HistoryOperationService();

    // Initialize cache with TTL of 10 minutes
    this.#cache = new NodeCache({
      stdTTL: 600,
      checkperiod: 120,
      useClones: false
    });
  }

  async #makeRequest(endpoint) {
    const cacheKey = `api_${endpoint}`;

    // Check if data is in cache
    const cachedData = this.#cache.get(cacheKey);
    if (cachedData) {
      logger.debug(`Retrieved data from cache for ${endpoint}`);
      return cachedData;
    }

    // Make API request if not in cache
    logger.debug(`Making API request to ${endpoint}`);
    try {
      const response = await this.#axios.get(endpoint);

      // Validate response
      if (!response.data) {
        throw new Error('Empty response from API');
      }

      // Cache the result
      this.#cache.set(cacheKey, response.data);

      // save in history
      console.log('response', response.statusText);
      await this.#historyOperationService.addHistoryOperation({
        endpoint: endpoint,
        status: String(response.status),
        message: String(response.statusText)
      }).catch(error => {
        logger.error('Error saving history operation', { error: error.message });
      });

      return response.data;
    } catch (error) {
      logger.error(`Error fetching data from ${endpoint}`, { error: error.message });
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  async getAllStations() {
    try {
      // Use cached stations if available
      if (this.#stations.length > 0 && this.#cache.get('stations_data')) {
        logger.debug('Returning cached stations data');
        return this.#stations;
      }

      logger.info('Fetching all stations data from API');
      const data = await this.#makeRequest('/stations');

      // Process station data
      this.#stations = data
        .map(station => Station.fromApiData(station))
        .filter(Boolean); // Remove null entries

      // Update status for all stations
      await this.#updateStationsStatus();

      // Cache the processed stations
      this.#cache.set('stations_data', this.#stations, 600); // 10 minutes TTL

      return this.#stations;
    } catch (error) {
      logger.error('Error in getAllStations', { error: error.message });
      throw error;
    }
  }

  async #updateStationsStatus() {
    try {
      logger.debug('Updating station statuses');
      const statusData = await this.#makeRequest('/StationsStatus');

      // Map of station codes to their status
      const statusMap = new Map(
        statusData.map(item => [item.AhuzotCode, item.InformationToShow])
      );

      // Update status for each station
      for (const station of this.#stations) {
        const status = statusMap.get(station.code);
        if (status) {
          station.updateStatus(status);
        }
      }

      logger.debug('Station statuses updated successfully');
    } catch (error) {
      logger.error('Error updating station statuses', { error: error.message });
      throw new Error(`Failed to update station statuses: ${error.message}`);
    }
  }

  async getTheClosestStation(latitude, longitude) {
    try {
      if (!latitude || !longitude) {
        throw new Error('Latitude and longitude are required');
      }

      // Parse coordinates
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid latitude or longitude');
      }

      logger.debug(`Finding closest station to (${lat}, ${lng})`);

      // Ensure stations are loaded
      if (this.#stations.length === 0) {
        await this.getAllStations();
      }

      // Find closest available station
      let closestStation = null;
      let minDistance = Infinity;

      for (const station of this.#stations) {
        if (!station.isAvailable()) continue;

        const distance = station.calculateDistance(lat, lng);
        if (distance < minDistance) {
          minDistance = distance;
          closestStation = station;
        }
      }

      if (!closestStation) {
        logger.warn('No available stations found');
        return null;
      }

      logger.debug(`Found closest station: ${closestStation.name} at ${minDistance.toFixed(2)}m`);

      // Add distance to the result
      const result = closestStation.toJSON();
      result.distance = {
        meters: minDistance,
        kilometers: minDistance / 1000
      };

      return result;
    } catch (error) {
      logger.error('Error finding closest station', { error: error.message });
      throw error;
    }
  }
}

export default ParkingService;