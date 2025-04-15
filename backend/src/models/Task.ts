// src/models/Task.ts
import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ITask extends Document {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'completed';
    createdAt: Date;
}

const TaskSchema: Schema = new Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<ITask>('Task', TaskSchema);