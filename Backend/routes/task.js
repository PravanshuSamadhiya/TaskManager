import { createTask, deleteTask, getTasks, updateTask, updateTaskStatus } from '../controllers/task.controller.js';
import express from "express";
import protect from "../middleware/authMiddleware.js"
const router = express.Router();

router.use(protect);

router.post('/', createTask);
router.get("/", getTasks);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);



export default router;
