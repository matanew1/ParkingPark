const express = require("express");
const ParkingController = require("../controllers/parking.js");
const router = express.Router();
const parkingController = new ParkingController();

/**
 * @openapi
 * /api/parking/stations:
 *   get:
 *     description: Use to request all stations
 *     responses:
 *       '200':
 *         description: A successful response
 */
router.get("/stations", parkingController.getAllStations);

/**
 * @openapi
 * /api/parking/stations/closestStation:
 *   get:
 *     description: Use to request the closest station
 *     parameters: 
 *      - name: latitude
 *        in: query
 *        description: latitude
 *        required: true
 *        schema:
 *          type: number
 *          format: float
 *      - name: longitude
 *        in: query
 *        description: longitude
 *        required: true
 *        schema:
 *          type: number
 *          format: float
 *     responses:
 *       '200':
 *         description: A successful response
 *       '400':
 *         description: A bad request response
 *       '404':
 *         description: A not found response
 */
router.get("/stations/closestStation", parkingController.getTheClosestStation);

module.exports = router;