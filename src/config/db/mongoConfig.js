import mongoose from 'mongoose';
import { MONGO_URI } from '../config.js';

export const connectMongoDB = async () => {
  try {
    const mongoUri =  MONGO_URI || 'mongodb://localhost:27017/mvimerzion_bd';
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
