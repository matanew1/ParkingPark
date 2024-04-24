import dotenv from "dotenv";
import axios from "axios";
import Station from "../models/station.js";
import { status } from "../utils/consts.js";
import TranslateService from "./translate.js";
import { decisionMakerByText } from "../AIModel/model.js";

dotenv.config();

class ParkingService {
  #axios;
  #stations;
  #translateService;

  constructor() {
    this.#axios = axios.create({
      baseURL: process.env.BASE_URL,
    });
    this.#stations = [];
    this.#translateService = new TranslateService();
  }

  async #makeRequest(endpoint) {
    const response = await this.#axios.get(endpoint);
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.data;
  }

  async getAllStations() {
    try {
      const data = await this.#makeRequest("/stations");
      this.#stations = data
        .map(station => this.#extractStationData(station))
        .filter(stationData => stationData !== null)
        .map(stationData => new Station(...stationData));
      await this.#updateStationsStatus();
      return this.#stations;
    } catch (error) {
      console.error("Error", error.message);
      throw error;
    }
  }

  async #updateStationsStatus() {
    try {
      const statusData = await this.#makeRequest("/StationsStatus");
      this.#stations.forEach(station => {
        const { InformationToShow } = statusData.find(s => s.AhuzotCode === station.Code) || {};
        if (InformationToShow) station.updateStatus(InformationToShow);
      });
    } catch (error) {
      console.error("Error updating station status", error.message);
      throw error;
    }
  }

  async getTheClosestStation(latitude, longitude) {
    try {
      if (!this.#stations.length) {
        await this.getAllStations();
      }
      const closestStation = this.#stations.reduce((closest, station) => {
        const distance = station.calculateDistance(latitude, longitude);
        if (
          !closest ||
          (distance < closest.distance &&
            station.Status !== status.CloseOrNotAvailable &&
            station.Status !== status.Full)
        ) {
          closest = { distance, station };
        }
        return closest;
      }, null);
      return closestStation ? closestStation.station : null;
    } catch (error) {
      console.error("Error", error.message);
      throw error;
    }
  }

  async getCheapestStation(latitude, longitude) {
    try {
      if (!this.#stations.length) {
        await this.getAllStations();
      }
  
      const openStations = this.#stations.filter(station => station.Status !== status.CloseOrNotAvailable);
      const stationsWithDistance = await Promise.all(openStations.map(async station => ({
        ...station,
        distance: await station.calculateDistance(latitude, longitude)
      })));
  
      const closestStations = stationsWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
  
      const translationCache = {};
  
      // Translate the daytime fee for each station and display the options to the user for decision making 
      await Promise.allSettled(closestStations.map(async station => {
        if (!translationCache[station.DaytimeFee]) {
          let translatedDaytimeFee = await this.#translateService.translateText(station.DaytimeFee, "en");
          translatedDaytimeFee = translatedDaytimeFee.replaceAll("¼", "quarter of an hour").replaceAll("NIS", "New Israeli Shekel");
          translationCache[station.DaytimeFee] = translatedDaytimeFee;
        }
        station.DaytimeFee = translationCache[station.DaytimeFee];
      }));
  
      const decisionString = closestStations.reduce((acc, station) => `${acc}Option ${station.Code}: Entry fee is ${station.DaytimeFee} and the distance from the current location is ${station.distance} meters.\n`, `Given the following parking options, which one is the most cost-effective and closest (the lower the distance in meters, the closer the location)?\n`);
  
      let decision = null;
      while (!decision) {
        const decisionResponse = await decisionMakerByText(decisionString);
        const num = Number(decisionResponse[0]?.generated_text.match(/option (\d+)/i)?.[1] ?? -1);
        if (num !== -1) {
          decision = num;
        }
      }
  
      return closestStations.find(station => station.Code == decision);
    } catch (error) {
      console.error("Error", error.message);
      throw error;
    }
  }

  #extractStationData(station) {
    const { AhuzotCode, Name, Address, GPSLattitude, GPSLongitude, DaytimeFee, FeeComments } = station;
    return AhuzotCode && Name && Address && GPSLattitude && GPSLongitude && DaytimeFee && FeeComments
      ? [AhuzotCode, Name, Address, GPSLattitude, GPSLongitude, DaytimeFee, FeeComments]
      : null;
  }
}

export default ParkingService;
