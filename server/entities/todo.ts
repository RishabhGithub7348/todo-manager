import mongoose, { Schema, Document } from 'mongoose';
import Joi from 'joi';
import { generatePublicID } from '../utils/ids';
import { PublicIDPrefixes } from '../config/prefixes';

export interface ITodo extends Document {
  pid: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  userPid: string;
  completed: boolean;
  tags?: string[];
  mentions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema = new Schema<ITodo>({
  pid: {
    type: String,
    unique: true,
    default: () => generatePublicID(PublicIDPrefixes.TODO),
  },
  title: { type: String, required: true },
  description: { type: String },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  userPid: { type: String, required: true },
  completed: { type: Boolean, default: false },
  tags: [{ type: String }],
  mentions: [{ type: String }],
}, { timestamps: true });

export const TodoModel = mongoose.model<ITodo>('Todo', TodoSchema);

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  userPid: string;
  tags?: string[];
  mentions?: string[];
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  completed?: boolean;
  tags?: string[];
  mentions?: string[];
}

export const CreateTodoRequestSchema = Joi.object<CreateTodoRequest>({
  title: Joi.string().required().messages({
    'string.base': 'Title must be a string',
    'any.required': 'Title is required',
  }),
  description: Joi.string().allow('').optional(),
  priority: Joi.string().valid('high', 'medium', 'low').default('medium'),
  userPid: Joi.string().required().messages({
    'string.base': 'User PID must be a string',
    'any.required': 'User PID is required',
  }),
  tags: Joi.array().items(Joi.string()).optional(),
  mentions: Joi.array().items(Joi.string()).optional(),
});

export const UpdateTodoRequestSchema = Joi.object<UpdateTodoRequest>({
  title: Joi.string().optional(),
  description: Joi.string().allow('').optional(),
  priority: Joi.string().valid('high', 'medium', 'low').optional(),
  completed: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  mentions: Joi.array().items(Joi.string()).optional(),
});