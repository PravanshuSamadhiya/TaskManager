import { Task } from "../models/task.js";
import { TimeLog } from "../models/timelog.js";


export const startTimer = async (req, res) => {
    try {
        const { taskId } = req.body;

        const task = await Task.findOne({ _id: taskId, user: req.user._id });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const newLog = await TimeLog.create({
            user: req.user._id,
            task: taskId,
            startTime: new Date()
        });
        res.status(201).json(newLog);
    } catch (error) {
        console.error('Start Timer Error:', error);
        res.status(500).json({ message: 'Failed to start timer' });
    }
}

export const stopTimer = async (req, res) => {
    try {
        const { taskId } = req.body;

        const log = await TimeLog.findOne({
            user: req.user._id,
            task: taskId,
            status: 'active'
        });

        if (!log) return res.status(404).json({ message: 'No active timer found' });

        log.endTime = new Date();
        log.status = 'stopped';
        log.duration = Math.floor((log.endTime - log.startTime) / 1000);

        await log.save();
        res.json(log);
    } catch (error) {
        console.error('Stop Timer Error:', error);
        res.status(500).json({ message: 'Failed to stop timer' });
    }
}

export const getAllTimeLogs = async (req, res) => {
    try {
        const logs = await TimeLog.find({
            task: req.params.taskId,
            user: req.user._id
        }).sort({ createdAt: -1 });

        res.json(logs);
    } catch (error) {
        console.error('Get Logs Error:', error);
        res.status(500).json({ message: 'Failed to fetch time logs' });
    }
}