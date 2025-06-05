import { PaqueteRepository } from "../../repository/postgress/package.js";

// services/paqueteService.js
export class PaqueteService {
  constructor() {
    this.paqueteRepository = new PaqueteRepository(); // Crear instancia de PaqueteRepository
  }

  async createPaquete(paqueteData) {
    try {
      // Validar fechas
      if (paqueteData.fechaInicio && paqueteData.fechaFin) {
        if (new Date(paqueteData.fechaInicio) >= new Date(paqueteData.fechaFin)) {
          throw new Error("La fecha de inicio debe ser anterior a la fecha de fin.");
        }
      }
  
      return await this.paqueteRepository.create(paqueteData); // Usar la instancia
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Ya existe un paquete con ese nombre');
      }
      throw error;
    }
  }  

 async getPaqueteById(id) {
    const numericId = Number(id); // Convertir a número
    if (isNaN(numericId)) { // Validar que sea un número válido
        throw new Error("El ID proporcionado no es válido.");
    }

    const paquete = await this.paqueteRepository.findById(numericId); // Pasar el ID convertido
    if (!paquete) {
        throw new Error("Paquete no encontrado");
    }
    return paquete;
}

async getAllPackagePaginated(page = 1, limit = 10) {
  // Validar los valores de page y limit
  const validatedPage = Math.max(page, 1);
  const validatedLimit = Math.max(limit, 1);
  const skip = (validatedPage - 1) * validatedLimit;

  try {
    // Obtener paquetes paginados y el total de elementos
    const packages = await this.paqueteRepository.getAllPackagePaginated(skip, validatedLimit);
    const totalItems = await this.paqueteRepository.countAll();
    const totalPages = Math.ceil(totalItems / validatedLimit);

    // Devolver la respuesta paginada
    return {
      packages,
      currentPage: validatedPage,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error("Error al obtener paquetes paginados:", error);
    throw new Error("No se pudieron obtener los paquetes");
  }
}

  async updatePaquete(id, data) {
    const paquete = await this.paqueteRepository.findById(id); // Usar la instancia
    if (!paquete) throw new Error('Paquete no encontrado');

    if (data.fechaInicio && data.fechaFin) {
      if (new Date(data.fechaInicio) >= new Date(data.fechaFin)) {
        throw new Error("La fecha de inicio debe ser anterior a la fecha de fin.");
      }
    }
    return await this.paqueteRepository.update(id, data); // Usar la instancia
  }

  async getPaquetesActivos(page = 1, limit = 5) {
    return await this.paqueteRepository.findActivePackages(page, limit); // Pasar los parámetros
  }
  

  async togglePaqueteStatus(id) {
    const paquete = await this.paqueteRepository.findById(id); // Usar la instancia
    if (!paquete) throw new Error('Paquete no encontrado');
    return await this.paqueteRepository.update(id, {
      activo: !paquete.activo
    }); // Usar la instancia
  }

  async getDaysAvailable(id){
    const idNumber=Number(id)
    return await this.paqueteRepository.getDaysAvailableByPackageId(idNumber);
  }
}
