import mongoose, { Schema, Document } from 'mongoose';
import { generatePublicID } from '../utils/ids';
import { PublicIDPrefixes } from '../config/prefixes';

export interface IUser extends Document {
  pid: string;
  username: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  pid: {
    type: String,
    unique: true,
    default: () => generatePublicID(PublicIDPrefixes.USER),
  },
  username: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>('User', UserSchema);