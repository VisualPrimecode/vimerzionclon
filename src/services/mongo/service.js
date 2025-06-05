import { subirArchivoAFirebase, eliminarArchivoAntiguo } from "../../utils/firebaseUtil.js";
import { ServicioRepository } from "../../repository/mongo/service.js";

export const ServicioService = {
  // Crear un servicio con múltiples imágenes
  async create(data, files) {
    const fotosConTitulos = JSON.parse(data.fotos || '[]'); // Parsear títulos enviados desde el frontend
    console.log(fotosConTitulos)

    // Subir imágenes nuevas a Firebase
    const fotosUrls = await Promise.all(
      files.map((file) => subirArchivoAFirebase(file, "servicios"))
    );

    // Combinar URLs con sus títulos
    const fotosFinales = fotosUrls.map((url, index) => ({
      url,
      titulo: fotosConTitulos[index]?.titulo || 'Sin título',
      descripcion_foto: fotosConTitulos[index]?.descripcion_foto || 'Sin descripción',
    }));

    console.log(fotosFinales)

    // Crear el servicio con las fotos
    return await ServicioRepository.create({
      ...data,
      fotos: fotosFinales,
    });
  },


  async update(id, data, files) {
    const servicio = await ServicioRepository.findById(id);
    if (!servicio) {
        throw new Error("El servicio no fue encontrado.");
    }

    // Parsear fotos existentes del FormData
    const fotosExistentes = data.fotos ? JSON.parse(data.fotos) : [];

    // Subir nuevas imágenes y mantener sus títulos originales
    const fotosNuevas = [];
    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const url = await subirArchivoAFirebase(files[i], "servicios");

            // Buscar el objeto correspondiente en fotosExistentes que tenga URL vacía
            const fotoCorrespondiente = fotosExistentes.find(f => !f.url);

            fotosNuevas.push({
                url,
                titulo: fotoCorrespondiente?.titulo || `Foto ${i + 1}`, // Asegurar que sea string
                descripcion_foto: fotoCorrespondiente?.descripcion_foto || 'Sin descripción', // Asegurar que sea string
            });
        }
    }

    // Filtrar las fotos existentes para eliminar las que tienen URL vacía
    const fotosExistentesFiltradas = fotosExistentes.filter(foto => foto.url);

    // Combinar fotos existentes con las nuevas
    const fotosActualizadas = [
        ...fotosExistentesFiltradas, // Fotos existentes
        ...fotosNuevas, // Fotos nuevas procesadas
    ];

    console.log('Fotos actualizadas:', fotosActualizadas);

    // Eliminar fotos que ya no están en fotosExistentes
    const fotosAEliminar = servicio.fotos.filter(
        foto => !fotosExistentesFiltradas.some(f => f.url === foto.url)
    );
    await Promise.all(fotosAEliminar.map(foto => eliminarArchivoAntiguo(foto.url)));

    // Actualizar el servicio
    const servicioActualizado = await ServicioRepository.updateById(id, {
        titulo: data.titulo,
        descripcion: data.descripcion,
        activo: data.activo === 'true',
        fotos: fotosActualizadas,
    });

    return servicioActualizado;
},


  // Buscar un servicio por su ID
  async findById(id) {
    const servicio = await ServicioRepository.findById(id);
    if (!servicio) {
      throw new Error("El servicio no fue encontrada.");
    }
    return servicio;

  },

  // Buscar un servicio por su título
  async findByTitle(titulo) {
   const servicio = await ServicioRepository.findByName(titulo)

   if (!servicio) {
    throw new Error("El servicio no fue encontrado.");
  }
  return servicio;
  },

  // Desactivar un servicio
  async deactivate(id) {
    const servicio = await ServicioRepository.findById(id);
    if (!servicio) {
      throw new Error("El servicio no fue encontrado.");
    }

    servicio.activo = false;
    return await servicio.save();
  },

  // Servicio
async findAllPaginated(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  // Llama al repositorio para obtener datos paginados
  const { servicios, total } = await ServicioRepository.findAllPaginated(skip, limit);

  // Devuelve el formato paginado
  return {
    servicios,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
},
};
