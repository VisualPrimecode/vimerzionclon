import express from 'express';
import { crearReserva, confirmarReserva, obtenerCupos } from '../controller/reserva.js';

const router = express.Router();

// ✅ Rutas para gestionar reservas
router.post('/', crearReserva); // Crear una reserva
router.post('/reservas/confirmar', confirmarReserva); // Confirmar una reserva
router.get('/cupos', obtenerCupos); // Obtener cupos disponibles

export default router;
