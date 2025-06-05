import { UserService } from '../services/postgress/user.js';

export async function registerUser(req, res) {
  try {
   
    const userService=new UserService();
    // Llamar al servicio para registrar al usuario
    const user = await userService.register(req.body);

    res.status(201).json({ message: 'Usuario creado con éxito' });
  } catch (error) {
    console.error('Error en el controlador (registerUser):', error.message); // Log del error
    res.status(400).json({
      message: error.message,
    });
  }
}

