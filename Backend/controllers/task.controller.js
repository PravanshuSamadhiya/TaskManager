import { Task } from "../models/task.js";
import { generateTaskDetails } from "../utils/generateTask.js";


export const createTask = async (req, res) => {
    try {
        const { input } = req.body;

        if (!input) {
            return res.status(400).json({ message: 'Task input is required' });
        }

        const { title, description } = await generateTaskDetails(input);

        const task = await Task.create({
            user: req.user._id,
            title,
            description: JSON.stringify(description),
        });
        res.status(201).json(task);
    } catch (error) {
        console.error('Create Task Error:', error);
        res.status(500).json({ message: 'Failed to create task' });
    }
}

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error('Fetch Tasks Error:', error);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
}

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

        if (!task) return res.status(404).json({ message: 'Task not found' });

        const { title, description, status } = req.body;

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;

        await task.save();
        res.json(task);
    } catch (error) {
        console.error('Update Task Error:', error);
        res.status(500).json({ message: 'Failed to update task' });
    }
}

export const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) return res.status(400).json({ message: 'Status is required' });

        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.status = status;
        await task.save();

        res.json(task);
    } catch (error) {
        console.error('Update Task Status Error:', error);
        res.status(500).json({ message: 'Failed to update task status' });
    }
}

export const deleteTask = async(req, res) => {
   try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task deleted successfully' });
   } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({ message: 'Failed to delete task' });
   }
}  