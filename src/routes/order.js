import express from 'express';
import { 
  createOrden, 
  createOrdenWithWebpay, 
  confirmWebpayTransaction, 
  getOrdenById, 
  updateOrdenStatus, 
  getOrdenesByUsuario,
  getAllOrdenesPaginated

} from '../controller/order.js';

const router = express.Router();

// Rutas para órdenes
router.post('/', createOrden); // Crear una orden
router.post('/webpay', createOrdenWithWebpay); // Crear una orden e iniciar transacción con Webpay
router.get('/paquetes',getAllOrdenesPaginated)
router.get('/:id', getOrdenById); // Obtener una orden por ID
router.put('/:id/estado', updateOrdenStatus); // Actualizar estado de una orden
router.get('/paginated/:usuarioId', getOrdenesByUsuario); // Obtener órdenes de un usuario con filtros

// Rutas para Webpay
router.post('/webpay/confirm', confirmWebpayTransaction); // Confirmar transacción de Webpay

export default router;
