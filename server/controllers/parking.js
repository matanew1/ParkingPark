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
}

module.exports = ParkingController;