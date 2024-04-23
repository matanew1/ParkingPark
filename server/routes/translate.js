import express from "express";
import TranslateController from "../controllers/translate.js";

const router = express.Router();

/**
 * @openapi
 * /api/translate:
 *   post:
 *     description: Use to translate text
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               to:
 *                 type: string
 *                 default: en
 *             required:
 *               - text
 *               - targetLanguage
 *     responses:
 *       '200':
 *         description: A successful response
 *       '400':
 *         description: A bad request response
 *       '500':
 *         description: A server error response
 */
router.post("/", TranslateController.translateText);

export default router;