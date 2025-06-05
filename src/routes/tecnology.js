import express from 'express';
import {
    createTecnologia,
    deactivateTecnologia,
    findAllPaginatedTecnologia
    ,findByIdTecnologia,
    findByNameTecnologia
    ,updateTecnologia
} from '../controller/tecnology.js'; // Importa los controladores
import { uploadFotoTecnologia } from '../middleware/uploadFile.js'; 
const router = express.Router();

// Rutas CRUD para usuarios
router.post('/',uploadFotoTecnologia,createTecnologia ); // Crear un usuario
// Rutas CRUD para usuarios
router.put('/:id',uploadFotoTecnologia,updateTecnologia ); // Crear un usuario
// Rutas CRUD para usuarios
router.get('/',findAllPaginatedTecnologia ); // Crear un usuario

// Rutas CRUD para usuarios
router.get('/:id',findByIdTecnologia ); // Crear un usuario
// Rutas CRUD para usuarios
router.get('/nombre/:nombre',findByNameTecnologia ); // Crear un usuario
router.patch('/:id',deactivateTecnologia ); // Crear un usuario

export default router;