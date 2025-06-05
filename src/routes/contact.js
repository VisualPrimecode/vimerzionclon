import express from 'express'
import { contact } from "../controller/contact.js";

const router = express.Router();

// Rutas CRUD para usuarios
router.post('/',contact ); // Crear un usuario

export default router;