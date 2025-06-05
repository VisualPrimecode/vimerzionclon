// controllers/adminController.js
import { UserService } from '../services/postgress/user.js';

export async function registerAdmin(req, res) {
  try {
    const userService = new UserService();

    // El rol viene del frontend, no se asigna automáticamente
    const user = await userService.register(req.body);

    res.status(201).json({ message: 'Administrador registrado con éxito', data: user });
  } catch (error) {
    console.error('Error en el controlador (registerAdmin):', error.message);
    res.status(400).json({ message: error.message });
  }
}

export async function  updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const userService = new UserService();

      
      const updatedUser = await userService.update(id, userData);
      
      res.json({ 
        message: 'Usuario actualizado con éxito', 
        data: updatedUser 
      });
    } catch (error) {
      console.error('Error en el controlador (updateUser):', error.message);
      res.status(400).json({ message: error.message });
    }
}

export async function  deactivateUser(req, res) {
    try {
      const { id } = req.params;
      const userService = new UserService();

      await userService.deactivate(id);
      
      res.json({ 
        message: 'Usuario desactivado exitosamente' 
      });
    } catch (error) {
      console.error('Error en el controlador (deactivateUser):', error.message);
      res.status(400).json({ message: error.message });
    }
  }

  export async function getPaginatedUsers(req, res) {
    try {
      const { page = 1, limit = 10, rol: rolFilter = null } = req.query; // Extraer rolFilter de los parámetros de consulta
      const userService = new UserService();
  
      const result = await userService.getPaginated(page, limit, rolFilter); // Pasar rolFilter al servicio
  
      res.json({
        message: 'Usuarios obtenidos con éxito',
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error en el controlador (getPaginatedUsers):', error.message);
      res.status(400).json({ message: error.message });
    }
  }
  


export   async function getUserById(req, res) {
    try {
      const { id } = req.params;
      const userService = new UserService();

      const user = await userService.findById(id);
      
      if (!user) {
        return res.status(404).json({ 
          message: 'Usuario no encontrado' 
        });
      }

      res.json({ 
        message: 'Usuario encontrado con éxito', 
        ...user 
      });
    } catch (error) {
      console.error('Error en el controlador (getUserById):', error.message);
      res.status(400).json({ message: error.message });
    }
  }

  export async function getRoles(req, res) {
    try {
      const userService = new UserService();
  
      // Llamar al servicio para obtener los roles
      const roles = await userService.getRoles();
  
      // Enviar respuesta exitosa
      res.status(200).json({
        message: 'Roles obtenidos con éxito',
        data: roles,
      });
    } catch (error) {
      console.error('Error en el controlador (getRoles):', error.message);
  
      // Manejar error y devolver respuesta con el mensaje de error
      res.status(400).json({
        message: error.message || 'Error al obtener roles',
      });
    }
  }