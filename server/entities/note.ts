import mongoose, { Schema } from 'mongoose';
import { generatePublicID } from '../utils/ids';
import { PublicIDPrefixes } from '../config/prefixes';
import Joi from 'joi';

export interface INote extends Document {
  pid: string;
  content: string;
  todoPid: string;
  userPid: string;
  createdAt: Date;
}

const NoteSchema = new Schema<INote>({
  pid: {
    type: String,
    unique: true,
    default: () => generatePublicID(PublicIDPrefixes.NOTE),
  },
  content: { type: String, required: true },
  todoPid: { type: String, required: true },
  userPid: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const NoteModel = mongoose.model<INote>('Note', NoteSchema);

export interface CreateNoteRequest {
  content: string;
  todoPid: string;
  userPid: string;
}

export const CreateNoteRequestSchema = Joi.object<CreateNoteRequest>({
  content: Joi.string().required().messages({
    'string.base': 'Note content must be a string',
    'any.required': 'Note content is required',
  }),
  todoPid: Joi.string().required().messages({
    'string.base': 'Todo PID must be a string',
    'any.required': 'Todo PID is required',
  }),
  userPid: Joi.string().required().messages({
    'string.base': 'User PID must be a string',
    'any.required': 'User PID is required',
  }),
});