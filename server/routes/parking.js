// parking.js

import express from "express";
import ParkingController from "../controllers/parking.js";

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

/**
 * @openapi
 * /api/parking/stations/{id}:
 *   get:
 *      description: Use to request the station by id
 *      parameters:
 *       - name: id
 *         in: path
 *         description: id
 *         required: true
 *         schema:
 *          type: string
 *      responses:
 *         '200':
 *              description: A successful response
 *         '404':
 *              description: A not found response
 */
router.get("/stations/:id", parkingController.getStationById);

/**
 * @openapi
 * /api/parking/stations/cheapestStation:
 *   get:
 *      description: Use to request the cheapest station
 *   responses:
 *      '200':
 *          description: A successful response
 *      '404':
 *          description: A not found response
 */

router.get("/stations/cheapestStation", parkingController.getCheapestStation);

export default router;