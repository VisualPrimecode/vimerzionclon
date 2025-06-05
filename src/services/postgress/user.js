import { UserRepository } from '../../repository/postgress/user.js';
import { hashPassword } from '../../utils/bcryptUti.js';
import { UserSchema } from '../../dtos/userDtos.js';

export class UserService{
   constructor() {
      this.UserRepository = new UserRepository(); // Crear instancia de PaqueteRepository
    }
  async register(userData) {
    try {

      if (!userData.nombreRol) {
        userData.nombreRol = 'CLIENTE';
      } else if (!['CLIENTE', 'ADMINISTRADOR'].includes(userData.nombreRol)) {
        throw new Error('Rol no válido');
      }
      
      // Validar datos usando el esquema
      const parsedUser = UserSchema.parse(userData);
      
      // Encriptar contraseña
      const hashedPassword = await hashPassword(parsedUser.password);
      
      
      // Preparar los datos para el repositorio
      const userForRepo = {
        username: parsedUser.username,
        email: parsedUser.email,
        hashed_password: hashedPassword,
        rol: parsedUser.nombreRol,
      };
      // Crear el usuario en el repositorio
      const createdUser = await this.UserRepository.create(userForRepo);
      return createdUser;
    } catch (error) {
      console.error('Error en el servicio (register):', error.message); // Log del error
      throw new Error(error.message);
    }
  }
  async update(id, userData) {
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId) || numericId <= 0) {
        throw new Error("ID inválido");
      }
  
      // Validación de password si viene en la actualización
      let dataToUpdate = { ...userData };
      if (userData.password !== undefined) {
        if (!userData.password.trim()) {
          throw new Error("La contraseña no puede estar vacía");
        }
        // Solo hashear si hay una nueva contraseña
        dataToUpdate.hashedPassword  = await hashPassword(userData.password);
        // Eliminar la password original del objeto de actualización
        delete dataToUpdate.password;
      }
  
      // Si se intenta actualizar el rol, validar que sea válido
      if (dataToUpdate.nombreRol && !['CLIENTE', 'ADMINISTRADOR'].includes(dataToUpdate.nombreRol)) {
        throw new Error('Rol no válido');
      }
  
      const updatedUser = await this.UserRepository.update(numericId, dataToUpdate);
      if (!updatedUser) {
        throw new Error("Usuario no encontrado");
      }
  
      // Omitir la contraseña hasheada en la respuesta
      const { hashedPassword, ...userResponse } = updatedUser;
      return userResponse;
    } catch (error) {
      console.error('Error en el servicio (update):', error);
      throw new Error(error.message || 'Error al actualizar usuario');
    }
  }
  async deactivate(id) {
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId) || numericId <= 0) {
        throw new Error("ID inválido");
      }

      const deactivated = await this.UserRepository.update(numericId, { activo: false });
      if (!deactivated) {
        throw new Error("Usuario no encontrado");
      }

      return true;
    } catch (error) {
      console.error('Error en el servicio (deactivate):', error);
      throw new Error(error.message || 'Error al desactivar usuario');
    }
  }
  async getPaginated(page, limit, rolFilter) {
    try {
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 10));
  
      // Validar rol si se proporciona
      if (rolFilter && !['CLIENTE', 'ADMINISTRADOR'].includes(rolFilter)) {
        throw new Error('Rol inválido');
      }
  
      const result = await this.UserRepository.findPaginated(pageNum, limitNum, rolFilter);
  
      // Transformar y sanitizar los usuarios
      const sanitizedUsers = result.users.map(user => {
        const { hashedPassword, rol, ...userWithoutSensitiveData } = user; // Excluir datos sensibles como hashedPassword
        return {
          ...userWithoutSensitiveData,
          rol: rol?.nombre, // Reemplazar el objeto rol por su propiedad nombre
        };
      });
  
      return {
        users: sanitizedUsers, // Usuarios transformados
        pagination: result.pagination, // Información de paginación
      };
    } catch (error) {
      console.error('Error en el servicio (getPaginated):', error);
      throw new Error(error.message || 'Error al obtener usuarios paginados');
    }
  }
  
  async getRoles() {
    try {
      return await this.UserRepository.getRoles();
    } catch (error) {
      console.error('Error en el servicio (getRoles):', error);
      throw new Error('Error al obtener roles');
    }
  }

  async findById(id) {
    try {
      const numericId = Number(id); // Convertir a número
      if (isNaN(numericId)) { // Validar que sea un número válido
          throw new Error("El ID proporcionado no es válido.");
      }
      // Validar datos usando el esquema
      const user = await this.UserRepository.findById(id);
      return {
        ...user,
        rol: user.rol?.nombre, // Reemplazar el objeto `rol` por solo su `nombre`
      };
    } catch (error) {
      console.error('Error en el servicio (GetById):', error.message); // Log del error
      throw new Error(error.message);
    }
  }
};
