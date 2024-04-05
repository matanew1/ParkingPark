const ParkingService = require("../services/parking");

class ParkingController {
    #parkingService;

    constructor() {
        this.#parkingService = new ParkingService();
    }

    getAllStations = async (req, res) => {
        try {
            const stations = await this.#parkingService.getAllStations();
            if (stations.length > 0) {
                res.status(200).json(stations);
            } else {
                res.status(404).json({ message: "No stations found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    getTheClosestStation = async (req, res) => {
        try {
            const { latitude, longitude } = req.query;
            if (!latitude || !longitude) {
                return res.status(400).json({ message: "Latitude and longitude are required" });
            }
            const closestStation = await this.#parkingService.getTheClosestStation(latitude, longitude);
            if (closestStation) {
                res.status(200).json(closestStation);
            } else {
                res.status(404).json({ message: "No stations found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = ParkingController;