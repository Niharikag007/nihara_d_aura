import mongoose from 'mongoose';
import { seedDatabaseIfEmpty } from './seed.js';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nihara_d_aura';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Live Connected: ${conn.connection.host}`);
    
    // Ensure all collections are populated with initial data if empty
    await seedDatabaseIfEmpty();
    return true;
  } catch (err) {
    console.error(`[Database] MongoDB Connection Error: ${err.message}`);
    return false;
  }
};
