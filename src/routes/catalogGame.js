import express from 'express';
import {
    createCatalogoJuego,
    updateCatalogoJuego,
    findById,
    deactivateCatalogoJuego,
    findAllPaginated,
    findByPlatform,
    findCatalogData
} from '../controller/catalgJuegos.js';
import { uploadFotosPlataformas } from '../middleware/uploadFile.js'; // Middleware para manejar archivos

const router = express.Router();

// Ruta para crear un nuevo juego en el catálogo
router.post('/', uploadFotosPlataformas, createCatalogoJuego);

// Ruta para actualizar un juego en el catálogo
router.put('/:id', uploadFotosPlataformas, updateCatalogoJuego);

// Ruta para listar juegos paginados (20 por página)
router.get('/', findAllPaginated);

router.get('/catalog-data', findCatalogData);
// Ruta para buscar un juego por ID
router.get('/id/:id', findById);

// Ruta para buscar juegos por plataforma
router.get('/platform/:platform', findByPlatform);

// Ruta para desactivar un juego
router.delete('/:id', deactivateCatalogoJuego);

export default router;
