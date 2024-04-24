// parking.js

import dotenv from "dotenv";
import axios from "axios";
import Station from "../models/station.js";
import { status } from "../utils/consts.js";
import TranslateService from "./translate.js";
import { initializeModel } from "../AIModel/model.js";

let decisionMakerByText;

initializeModel().then((model) => {
  decisionMakerByText = model.decisionMakerByText;
  // Now you can use decisionMakerByText
});

dotenv.config();

class ParkingService {
  #axios; // private field
  #stations; // private field
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

  async #updateStationsStatus(stations) {
    try {
      const status = await this.#makeRequest("/StationsStatus");
      stations.forEach((station) => {
        const { InformationToShow } = status.find(
          (s) => s.AhuzotCode === station.Code
        );
        station.updateStatus(InformationToShow);
      });
    } catch (error) {
      console.error("Error", error.message);
      throw error;
    }
  }

  async getAllStations() {
    try {
      const data = await this.#makeRequest("/stations");
      this.#stations = data.reduce((stations, station) => {
        const {
          AhuzotCode,
          Name,
          Address,
          GPSLattitude,
          GPSLongitude,
          DaytimeFee,
          FeeComments,
        } = station;
        if (
          AhuzotCode &&
          Name &&
          Address &&
          GPSLattitude &&
          GPSLongitude &&
          DaytimeFee &&
          FeeComments
        ) {
          stations.push(
            new Station(
              AhuzotCode,
              Name,
              Address,
              GPSLattitude,
              GPSLongitude,
              DaytimeFee,
              FeeComments
            )
          );
        }
        return stations;
      }, []);
      await this.#updateStationsStatus(this.#stations);
      return this.#stations;
    } catch (error) {
      console.error("Error", error.message);
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
      // get top 5 closest stations
      let closestStations = this.#stations
        .map((station) => {
          return {
            ...station,
            distance: station.calculateDistance(latitude, longitude),
          };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);

      // translate DaytimeFee to English
      closestStations = await Promise.all(
        closestStations.map(async (station) => {
          let translatedDaytimeFee = await this.#translateService.translateText(
            station.DaytimeFee,
            "en"
          );
          // replace each ¼ with 1/4
          translatedDaytimeFee = translatedDaytimeFee.replaceAll(
            "¼",
            "quarter of an hour"
          );
          // replace each NIS with New Israeli Shekel
          translatedDaytimeFee = translatedDaytimeFee.replaceAll(
            "NIS",
            "New Israeli Shekel"
          );
          return { ...station, DaytimeFee: translatedDaytimeFee };
        })
      );

      // the specific time of the day include hour and minutes in 24 hours format
      const currentTimestamp = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      });
      const decisionString = closestStations.reduce((acc, station) => {
        return `${acc}Option ${station.Code}: Entry fee is ${station.DaytimeFee} and the distance from the current location is ${station.distance} meters.\n`;
      }, `Given the following parking options, which one is the most cost-effective and closest (the lower the distance in meters, the closer the location)?\n`);

      let decision = null;
      while (!decision) {
        const decisionResponse = await decisionMakerByText(decisionString);
        const num = Number(
          decisionResponse[0]["generated_text"].match(/option (\d+)/i)?.[1] ?? -1
        );
        if (num !== -1) {
          decision = num;
        }
      }

      closestStations = closestStations.filter(
        (station) => station.Code == decision
      );
      return closestStations[0];
    } catch (error) {
      console.error("Error", error.message);
      throw error;
    }
  }
}

export default ParkingService;