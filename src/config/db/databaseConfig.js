import { connectMongoDB } from './mongoConfig.js';
import { connectPostgres } from './prismaConfig.js';

export const connectDatabases = async () => {
  try {
    // Conectar a MongoDB
    await connectMongoDB();

    // Conectar a PostgreSQL
    await connectPostgres();

    console.log('All databases connected successfully');
  } catch (error) {
    console.error('Error connecting to databases:', error.message);
    process.exit(1);
  }
};
