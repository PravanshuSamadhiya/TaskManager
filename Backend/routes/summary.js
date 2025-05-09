import express from "express";
const router = express.Router();
import protect from "../middleware/authMiddleware.js"
import { getSummary } from "../controllers/summary.controller.js";

router.get("/daily", protect, getSummary)

export default router;