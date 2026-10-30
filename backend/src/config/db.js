import mongoose from 'mongoose';
import { seedDatabaseIfEmpty } from './seed.js';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI or MONGODB_URI must be configured');
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log(`[Database] MongoDB Live Connected: ${conn.connection.host}`);
  await seedDatabaseIfEmpty();
  return true;
};
