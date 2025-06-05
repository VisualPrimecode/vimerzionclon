import express from 'express';
import {corsMiddleware} from './config/cors.js'
import userRoutes from './routes/user.js'
import authRoutes from './routes/auth.js'
import catalogGame from './routes/catalogGame.js'
import tecnologyRoute from './routes/tecnology.js'
import packageRoute from'./routes/package.js'
import orderRoute from'./routes/order.js'
import webPayRoute from'./routes/webpay.js'
import contactRoute from'./routes/contact.js'
import reservaRoute from './routes/reserva.js'
import desafioRoute from './routes/desafios.js'
import { connectDatabases } from './config/db/databaseConfig.js';

import cookieParser from 'cookie-parser';
const app = express();
 


// Middlewares
app.use(corsMiddleware);
app.use(cookieParser())
app.use(express.json());
// Conectar bases de datos
await connectDatabases();

app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/games',catalogGame)
app.use('/api/tecnology',tecnologyRoute)
app.use('/api/package',packageRoute)
app.use('/api/order',orderRoute)
app.use('/api/webpay',webPayRoute)
app.use('/api/contact',contactRoute)
app.use('/api/reserva',reservaRoute)
app.use('/api/desafios',desafioRoute)
export default app;
