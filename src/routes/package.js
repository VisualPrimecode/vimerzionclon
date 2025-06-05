import express from 'express';
import {
    createPaquete,
    updatePaquete,
    getPaqueteById,
    deactivatePaquete,
    getPaquetesActivos,
    getAllPackagePaginated,
    getDaysAvailable
} from '../controller/package.js';
import { uploadFotoPaqute } from '../middleware/uploadFile.js'; // Middleware para manejar archivos
import {verifyRoles} from '../middleware/verifyRoles.js'

const router = express.Router();

// Ruta para crear un nuevo juego en el catálogo
router.post('/',verifyRoles('ADMINISTRADOR'), uploadFotoPaqute, createPaquete);

// Ruta para actualizar un juego en el catálogo
router.put('/:id', uploadFotoPaqute, updatePaquete);

router.get('/', getAllPackagePaginated);

// Ruta para buscar juegos por plataforma
router.get('/activo', getPaquetesActivos); 
router.get('/dias-disponibles/:id',getDaysAvailable)
// Ruta para buscar un juego por ID
router.get('/id/:id', getPaqueteById);


// Ruta para desactivar un juego
router.patch('/:id', deactivatePaquete);

export default router;
