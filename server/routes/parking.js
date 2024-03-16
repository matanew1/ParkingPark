const express = require("express");
const ParkingController = require("../controllers/parking.js");

const router = express.Router();
const parkingController = new ParkingController();

/**
 * @openapi
 * /api/parking/stations:
 *  get:
 *    description: Use to request of all parking stations
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/stations", parkingController.getAllStations);

module.exports = router;