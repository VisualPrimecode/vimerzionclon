import express from 'express';
import {
    createServicio,
    deactivateServicio,
    findAllPaginatedServicio,
    findByIdServicio,
    findByNameServicio,
    updateServicio,
} from '../controller/service.js'; // Importa los controladores
import { uploadFotosServicios } from '../middleware/uploadFile.js'; 

const router = express.Router();

// Crear un servicio
router.post('/', uploadFotosServicios, createServicio);

// Actualizar un servicio
router.put('/:id', uploadFotosServicios, updateServicio);

// Obtener todos los servicios (paginados)
router.get('/', findAllPaginatedServicio);

// Obtener un servicio por ID
router.get('/id/:id', findByIdServicio);

// Obtener un servicio por nombre
router.get('/nombre/:titulo', findByNameServicio);

// Desactivar un servicio
router.patch('/:id', deactivateServicio);

export default router;
