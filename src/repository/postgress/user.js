import prisma from '../../config/db/prismaConfig.js';
export class UserRepository  {
  async findByEmail(email) {
    try {
      const user = await prisma.usuario.findUnique({
        where: { email },
        include: {
          rol: true,
        },
      });
      return user;
    } catch (error) {
      console.error('Error en el repositorio (findByEmail):', error.message); // Log del error
      throw new Error('Error al buscar usuario por email');
    }
  }

  async create(userData) {
    try {
      console.log('Datos recibidos en create:', userData); 
      const rol = await prisma.rol.findUnique({
        where: { nombre: userData.rol },
      });
      
      if (!rol) {
        throw new Error('Rol inválido');
      }

      
      const newUser = await prisma.usuario.create({
        data: {
          username: userData.username,
          hashedPassword: userData.hashed_password,
          email: userData.email,
          rolId: rol.id,
        },
      });
      return newUser;
    } catch (error) {
      console.error('Error en el repositorio (create):', error.message); // Log del error
      throw new Error('Error al crear usuario en la base de datos');
    }
  }

  async update(id, userData) {
    try {
      let updateData = {};

      // Construir objeto de actualización solo con campos proporcionados
      if (userData.username) updateData.username = userData.username;
      if (userData.email) updateData.email = userData.email;
      if (userData.hashedPassword) updateData.hashedPassword = userData.hashedPassword;
      if (userData.direccion) updateData.direccion = userData.direccion;
      
      // Si se proporciona un rol, buscar su ID
      if (userData.rol) {
        const rol = await prisma.rol.findUnique({
          where: { nombre: userData.rol },
        });
        if (!rol) {
          throw new Error('Rol inválido');
        }
        updateData.rolId = rol.id;
      }

      const updatedUser = await prisma.usuario.update({
        where: { id },
        data: updateData,
        include: {
          rol: true,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error('Error en el repositorio (update):', error.message);
      if (error.code === 'P2025') {
        throw new Error('Usuario no encontrado');
      }
      throw new Error('Error al actualizar usuario en la base de datos');
    }
  }

  async deactivate(id) {
    try {
      const user = await prisma.usuario.update({
        where: { id },
        data: {
          activo: false
        },
      });
      return user;
    } catch (error) {
      console.error('Error en el repositorio (deactivate):', error.message);
      if (error.code === 'P2025') {
        throw new Error('Usuario no encontrado');
      }
      throw new Error('Error al desactivar usuario en la base de datos');
    }
  }


  async findById(id) {
    try {
      const numericId = parseInt(id, 10); // Convertir a número entero
    if (isNaN(numericId)) { // Validar que el ID sea válido
      throw new Error('El ID proporcionado no es válido.');
    }
      const user = await prisma.usuario.findUnique({
        where: { id:numericId },
        include: {
          rol:{
            select:{
              nombre:true,
            },
          },
        },
      });
      return user;
    } catch (error) {
      console.error('Error en el repositorio (findById):', error.message); // Log del error
      throw new Error('Error al buscar usuario por id');
    }
  }
  async findPaginated(page = 1, limit = 10, rolFilter = null) {
    try {
      const skip = (page - 1) * limit;
      
      // Construir where clause basado en el filtro de rol
      const where = rolFilter ? {
        rol: {
          nombre: rolFilter
        }
      } : {};

      const [users, total] = await Promise.all([
        prisma.usuario.findMany({
          skip,
          take: limit,
          where,
          include: {
            rol: {
              select:{
                nombre:true,
              },
            },
          },
          orderBy: {
            id: 'desc'
          }
        }),
        prisma.usuario.count({ where }) // Contar solo los usuarios que cumplen el filtro
      ]);

      return {
        users,
        pagination: {
          total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + users.length < total
        }
      };
    } catch (error) {
      console.error('Error en el repositorio (findPaginated):', error.message);
      throw new Error('Error al obtener usuarios paginados');
    }
  }

  // Método para obtener roles disponibles
  async getRoles() {
    try {
      const roles = await prisma.rol.findMany();
      return roles;
    } catch (error) {
      console.error('Error en el repositorio (getRoles):', error.message);
      throw new Error('Error al obtener roles');
    }
  }

};
