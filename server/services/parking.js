require('dotenv').config();
const axios = require('axios');
const Station = require('../models/station');

class ParkingService {
    #axios; // private field
    #stations; // private field

    constructor() {
        this.#axios = axios.create({
            baseURL: process.env.BASE_URL,
        });
        this.#stations = [];
    }

    async #updateStationsStatus(stations) {
        try {
            const response = await this.#axios.get('/StationsStatus');
            if (response.status >= 200 && response.status < 300) {
                const status = response.data;
                stations.forEach(station => {
                    const { InformationToShow } = status.find(s => s.AhuzotCode === station.Code);
                    station.updateStatus(InformationToShow);
                });
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error', error.message);
            throw error;
        }
    }

    async getAllStations() {
        try {
            const response = await this.#axios.get('/stations');
            if (response.status >= 200 && response.status < 300) {
                this.#stations = response.data.reduce((stations, station) => {
                    const { AhuzotCode, Name, Address, GPSLattitude, GPSLongitude, DaytimeFee, FeeComments } = station;
                    if (AhuzotCode && Name && Address && GPSLattitude && GPSLongitude && DaytimeFee && FeeComments) {
                        stations.push(new Station(AhuzotCode, Name, Address, GPSLattitude, GPSLongitude, DaytimeFee, FeeComments));
                    }
                    return stations;
                }, []);
                await this.#updateStationsStatus(this.#stations);
                return this.#stations;
            } else {
                throw response.error;
            }
        } catch (error) {
            console.error('Error', error.message);
            throw error;
        }
    }
}

module.exports = ParkingService;