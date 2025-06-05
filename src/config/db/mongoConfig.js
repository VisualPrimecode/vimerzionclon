import mongoose from 'mongoose';
import { MONGO_URI } from '../config.js';

export const connectMongoDB = async () => {
  try {
    const mongoUri =  'mongodb+srv://matmolinas:ILA572bXVnhjowIS@cluster0.ca16u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
