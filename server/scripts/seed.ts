import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from '../entities/user';
import { generatePublicID } from '../utils/ids';
import { PublicIDPrefixes } from '../config/prefixes';

dotenv.config();

async function seedUsers() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in the .env file');
  }

  await mongoose.connect(uri);

  // Drop the users collection to ensure a clean state
  await mongoose.connection.collection('users').drop().catch(err => {
    if (err.codeName !== 'NamespaceNotFound') {
      console.error('Error dropping users collection:', err);
    }
  });

  // Ensure the unique index is clean
  await mongoose.connection.collection('users').createIndex({ pid: 1 }, { unique: true });

  const users = [
    { pid: generatePublicID(PublicIDPrefixes.USER), username: 'alex', displayName: 'Alex Johnson' },
    { pid: generatePublicID(PublicIDPrefixes.USER), username: 'maria', displayName: 'Maria Garcia' },
    { pid: generatePublicID(PublicIDPrefixes.USER), username: 'james', displayName: 'James Wilson' },
    { pid: generatePublicID(PublicIDPrefixes.USER), username: 'sarah', displayName: 'Sarah Chen' },
    { pid: generatePublicID(PublicIDPrefixes.USER), username: 'jamal', displayName: 'Jamal Ahmed' },
  ];

  // Debug: Log users to confirm pid values
  console.log('Users to insert:', users);

  await UserModel.insertMany(users);
  console.log('Users seeded');
  mongoose.connection.close();
}

seedUsers().catch(console.error);