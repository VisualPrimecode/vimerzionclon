import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el equivalente de __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar las variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

 
const PORT = process.env.PORT
 
// Token de firma para los usuarios
const JWT_SECRET = process.env.JWT_SECRET;
const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
const COMMERCE_CODE=process.env.COMMERCE_CODE;
const API_KEY=process.env.API_KEY;
const WEBPAY_ENV= process.env.WEBPAY_ENV;
const MONGO_URI=process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';
const EMAIL_USER= process.env.EMAIL_USER;
const EMAIL_DEST = process.env.EMAIL_DEST;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
const FRONTEND_URL = 'https://vimerzion.com';

  export { PORT, JWT_SECRET, FIREBASE_STORAGE_BUCKET, NODE_ENV, FRONTEND_URL,
    API_KEY,COMMERCE_CODE,WEBPAY_ENV,MONGO_URI,EMAIL_USER,EMAIL_DEST,EMAIL_PASSWORD
   };