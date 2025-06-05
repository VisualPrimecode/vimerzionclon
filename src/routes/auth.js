import express from 'express';
import {
    loginUser,
    getIdFromToken,
    getRemainingTime,
    getRoleFromToken,
    isAuthenticated,
    logoutUser
    

} from '../controller/auth.js'; // Importa los controladores
import {authMiddleware} from '../middleware/authMiddelware.js'
const router = express.Router();

// Rutas CRUD para usuarios
router.post('/login',loginUser ); // Crear un usuario
router.post('/logout',authMiddleware,logoutUser)
router.get('/authenticated' ,isAuthenticated);
router.get('/role', authMiddleware,getRoleFromToken);
router.get('/remaining-time', authMiddleware,getRemainingTime);
router.get('/id', authMiddleware,getIdFromToken);
export default router;