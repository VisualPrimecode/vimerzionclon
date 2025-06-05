import prisma from '../../config/db/prismaConfig.js';

export class OrdenRepository {
  async create(ordenData, ordenPaquetes) {
    try {
      return await prisma.$transaction(async (prisma) => {
        // Verificar stock de todos los paquetes primero
        for (const paquete of ordenPaquetes) {
          const paqueteData = await prisma.paquete.findUnique({
            where: { id: paquete.paqueteId },
            select: { stock: true },
          });
  
          
        }
  
        // Crear la orden sin actualizar el stock
        const orden = await prisma.orden.create({
          data: {
            ...ordenData,
            paquetes: {
              create: ordenPaquetes.map((paquete) => ({
                paqueteId: paquete.paqueteId,
                cantidad: paquete.cantidad,
                precioUnitario: paquete.precioUnitario,
                total: paquete.total,
                reservaId:paquete.reservaId, 
              })),
            },
          },
          include: {
            paquetes: true,
          },
        });
  
        return orden;
      });
    } catch (error) {
      console.error("Error en la transacción:");
      throw new Error("No se pudo completar la transacción. Por favor, inténtelo nuevamente.");
    }
  }
  

  async decreaseStock(ordenId) {
    console.log(`Iniciando decremento de stock para la orden: ${ordenId}`);
    try {
      return await prisma.$transaction(async (prisma) => {
        const orden = await prisma.orden.findUnique({
          where: { id: ordenId },
          include: {
            paquetes: true,
          },
        });
  
        if (!orden || !orden.paquetes.length) {
          throw new Error(`No se encontraron paquetes para la orden ${ordenId}`);
        }
  
        // Descontar el stock de cada paquete
        for (const ordenPaquete of orden.paquetes) {
          await prisma.paquete.update({
            where: { id: ordenPaquete.paqueteId },
            data: {
              stock: {
                decrement: ordenPaquete.cantidad,
              },
            },
          });
        }
  
        console.log(`🟩 Stock reducido exitosamente para la orden: ${ordenId}`);
        return true;
      });
    } catch (error) {
      console.error("Error al descontar el stock:");
      throw new Error(`Error al descontar el stock:`);
    }
  }
  
  

  async findById(id) {
    return await prisma.orden.findUnique({
        where: { id },
        include: {
            paquetes: {
                include: {
                    paquete: {
                        select: {
                            id: true,
                            nombre: true, // Selecciona solo los campos necesarios
                        }
                    },
                    reserva: { // 🔹 Se incluye la reserva asociada
                        select: {
                             // ID de la reserva
                            fecha: true, // Fecha de la reserva
                            estado: true // Estado actual de la reserva
                        }
                    }
                }
            },
            usuario: {
                select: {
                    id: true,
                    username: true,
                    email: true
                }
            }
        }
    });
}


  async updateStatus(id, estado) {
    return await prisma.orden.update({
      where: { id },
      data: { estado }
    });
  }

  async findAllOrdenesPaginated(skip = 0, take = 10) {
    try {
        // Obtener las órdenes con los datos relevantes
        const ordenes = await prisma.orden.findMany({
            skip,
            take,
            include: {
                usuario: { // Usa include para traer relaciones anidadas
                    select: {
                        username: true, // Trae solo el nombre de usuario del cliente
                    },
                },
            },
        });

        // Contar el total de órdenes para la paginación
        const totalOrdenes = await prisma.orden.count();

        // Formatear la respuesta para incluir los datos relevantes
        const formattedOrdenes = ordenes.map((orden) => ({
            id: orden.id,
            cliente: orden.usuario.username, // Muestra el nombre del cliente
            fecha: orden.fecha,
            total: orden.total,
            metodoPago: orden.metodoPago,
            estado: orden.estado,
        }));

        return {
            ordenes: formattedOrdenes,
            pagination: {
                totalItems: totalOrdenes,
                currentPage: Math.floor(skip / take) + 1,
                pageSize: take,
            },
        };
    } catch (error) {
        console.error('Error en findAllOrdenesPaginated:', error);
        throw new Error('Error al obtener las órdenes.');
    }
}



  
  
async findAllOrdenesByUserPaginated(usuarioId, skip = 0, take = 10) {
  try {
    // Validar que usuarioId sea válido
    if (!usuarioId) throw new Error("Usuario ID es requerido");

    // Obtener las órdenes con paginación
    const ordenes = await prisma.orden.findMany({
      where: { usuarioId }, // Filtrar por usuario
      skip, // Debe ser un entero
      take, // Debe ser un entero
      select: {
        id: true,
        fecha: true,
        total: true,
        metodoPago: true,
        estado: true,
      },
    });

    // Contar el total de órdenes del usuario
    const totalOrdenes = await prisma.orden.count({
      where: { usuarioId },
    });

    return {
      ordenes,
      pagination: {
        totalItems: totalOrdenes,
        currentPage: Math.floor(skip / take) + 1,
        pageSize: take,
      },
    };
  } catch (error) {
    console.error("Error en findAllOrdenesByUserPaginated:", error);
    throw new Error("Error al obtener las órdenes del usuario.");
  }
}




  
  
}