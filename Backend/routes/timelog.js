import { getAllTimeLogs, startTimer, stopTimer } from '../controllers/timeLog.controller.js';
import express from "express";
import protect from "../middleware/authMiddleware.js"
const router = express.Router();


router.use(protect);

router.post('/start', startTimer);
router.post('/stop', stopTimer);
router.get('/:taskId', getAllTimeLogs);

export default router;
