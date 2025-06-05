import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

// Crear una instancia única del cliente Prisma
const prisma = new PrismaClient();

// Exportar la instancia para usarla en otras partes del proyecto
export default prisma;

// Conexión manual para otros archivos si es necesario
export const connectPostgres = async () => {
  try {
    // Conectar a PostgreSQL
    await prisma.$connect();
    console.log('PostgreSQL connected successfully.');

    
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error.message);
    process.exit(1);
  }
};