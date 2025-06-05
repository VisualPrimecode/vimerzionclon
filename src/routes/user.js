import express from 'express';
import {
    registerUser
} from '../controller/user.js'; // Importa los controladores

import {registerAdmin,deactivateUser,getPaginatedUsers,getUserById,updateUser,getRoles}
from '../controller/admin.js'

import { authMiddleware } from '../middleware/authMiddelware.js';
import { verifyRoles } from '../middleware/verifyRoles.js';
const router = express.Router();

// Rutas CRUD para usuarios
router.post('/',registerUser ); // Crear un usuario
router.post('/create/admin',authMiddleware,verifyRoles('ADMINISTRADOR'),registerAdmin)
router.put('/update/:id',authMiddleware,verifyRoles('ADMINISTRADOR'),updateUser)
router.patch('/desacticated/:id',authMiddleware,verifyRoles('ADMINISTRADOR'),deactivateUser)
router.get('/paginated',authMiddleware,verifyRoles('ADMINISTRADOR'),getPaginatedUsers)
router.get('/roles', authMiddleware, verifyRoles('ADMINISTRADOR'), getRoles);
router.get('/:id',authMiddleware,verifyRoles('ADMINISTRADOR'),getUserById)

export default router;