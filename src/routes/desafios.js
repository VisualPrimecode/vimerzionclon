import express from 'express';
import {
    createDesafio,
    deactivateDesafio,
    findAllPaginatedDesafio,
    findByIdDesafio,
    updateDesafio
} from '../controller/desafio.js'; // Importa los controladores
const router = express.Router();

// Rutas CRUD para desafíos
router.post('/', createDesafio); // Crear un desafío
router.put('/:id', updateDesafio); // Actualizar un desafío
router.get('/', findAllPaginatedDesafio); // Obtener desafíos paginados
router.get('/:id', findByIdDesafio); // Buscar un desafío por ID
router.delete('/:id', deactivateDesafio); // Eliminar un desafío

export default router;
