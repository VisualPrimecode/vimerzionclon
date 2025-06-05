import mongoose from 'mongoose';
import { MONGO_URI } from '../config.js';

export const connectMongoDB = async () => {
  try {
    const mongoUri =  'mongodb://localhost:27017/vimerzionbd';
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
