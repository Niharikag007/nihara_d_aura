import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nihara_d_aura';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout if mongo is not locally active
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.warn(`[Database] MongoDB offline or not found (${err.message}). Using High-Performance Memory Data Store.`);
    return false;
  }
};
