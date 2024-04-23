import express from "express";
import AIController from "../controllers/ai.js";

const router = express.Router();
const aiController = new AIController();

/**
 * @openapi
 * /api/ai/decisionMaker:
 *   post:
 *     summary: Generate text
 *     description: Use to generate text based on input text
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The input text
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 generatedText:
 *                   type: string
 */
router.post("/decisionMaker", aiController.decisionMakerByText);

export default router;