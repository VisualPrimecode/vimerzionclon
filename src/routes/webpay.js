// src/routes/webpay.js
import express from 'express';
import { handleWebpayReturn, getTransactionStatus } from '../controller/webpay.js';

const router = express.Router();

// Ruta para el retorno de Webpay - aceptar tanto GET como POST
router.post('/return', handleWebpayReturn);
router.get('/return', handleWebpayReturn);  // Agregar soporte para GET

// Ruta para consultar estado de transacción
router.get('/status/:token', getTransactionStatus);

export default router;