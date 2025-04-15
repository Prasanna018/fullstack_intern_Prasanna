// src/controllers/taskController.ts
import { Request, Response } from 'express';
import Task from '../models/Task';
import { broadcastEvent } from '../sockets/taskSockets';

// Create a new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            res.status(400).json({ message: 'Title and description are required' });
            return;
        }

        const task = new Task({
            title,
            description
        });

        const savedTask = await task.save();

        // Broadcast the event to all connected clients
        broadcastEvent('task_created', savedTask);

        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create task', error });
    }
};

// Get all tasks
export const getAllTasks = async (_req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks', error });
    }
};

// Get a task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await Task.findOne({ id: req.params.id });

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch task', error });
    }
};

// Update task status
export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;

        if (!status || !['pending', 'completed'].includes(status)) {
            res.status(400).json({ message: 'Valid status (pending/completed) is required' });
            return;
        }

        const task = await Task.findOneAndUpdate(
            { id: req.params.id },
            { status },
            { new: true }
        );

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        // Broadcast the event to all connected clients
        broadcastEvent('task_updated', task);

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update task', error });
    }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await Task.findOneAndDelete({ id: req.params.id });

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        // Broadcast the event to all connected clients
        broadcastEvent('task_deleted', { id: req.params.id });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete task', error });
    }
};