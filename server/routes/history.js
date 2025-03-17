import express from "express";
import HistoryOperationController from "../controllers/history.js";

const router = express.Router();
const historyController = new HistoryOperationController();

/**
 * @openapi
 * /api/history/operations:
 *   get:
 *     description: Use to request all history operations
 *     responses:
 *       '200':
 *         description: A successful response
 *       '400':
 *         description: A bad request response
 *       '404':
 *         description: A not found response
 */
router.get("/operations", historyController.getAllHistoryOperation);


/**
 * @openapi
 * /api/history/operations:
 *  delete:
 *     description: Use to delete all history operations
 *     responses:
 *       '204':
 *         description: No content response (all operations deleted)
 *       '400':
 *         description: A bad request response
 */
router.delete("/operations", historyController.deleteAllHistoryOperation);

export default router;