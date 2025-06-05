import prisma from '../../config/db/prismaConfig.js';

export class PaqueteRepository {
  async create(data) {
    return await prisma.paquete.create({
      data
    });
  }

  async findById(id) {
    return await prisma.paquete.findUnique({
      where: { id },
      include: {
        descuentos: true
      }
    });
  }

  async getAllPackagePaginated(skip, limit) {
    return await prisma.paquete.findMany({
      skip,
      take: limit,
    });
  }

  async countAll() {
    return await prisma.paquete.count();
  }
  

  async findActivePackages(page = 1, limit = 5) {
    const now = new Date();
    const skip = (page - 1) * limit;
  
    return await prisma.paquete.findMany({
      where: {
        activo: true
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        precio: true,
        stock: true,
        foto:true,
        
      },
      skip,
      take: limit, // Límite de resultados por página
    });
  }
  

  async update(id, data) {
    return await prisma.paquete.update({
      where: { id },
      data
    });
  }

  async desactivPaquete(id){
    return await prisma.paquete.update({
        where: { id },
        data:{
            activo:false,
            updatedAt:new Date()
        }
      });

  }

  async updateStock(paqueteId, cantidad) {
    return await prisma.paquete.update({
      where: { id: paqueteId },
      data: {
        stock: {
          increment: cantidad // Usa `increment` para sumar/restar
        }
      }
    });
  }

  async getDaysAvailableByPackageId(id) {
    return await prisma.paquete.findUnique({
      where: {id},
      select:{
        diasDisponibles:true
      }
    })
  }

}