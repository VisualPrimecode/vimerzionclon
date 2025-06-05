import { TecnologiaRepository } from "../../repository/mongo/tecnology.js";
import { subirArchivoAFirebase, eliminarArchivoAntiguo } from "../../utils/firebaseUtil.js";

export const TecnologiaService = {
  async create(data, file) {
    if (!data.nombre || !data.descripcion || !file) {
      throw new Error("Faltan campos obligatorios.");
    }

    // Subir imagen a Firebase
    const imagenUrl = await subirArchivoAFirebase(file, "tecnologias");

    // Crear la tecnología con la imagen subida
    return await TecnologiaRepository.create({
      ...data,
      imagen: { url: imagenUrl },
    });
  },

  async findById(id) {
    const tecnologia = await TecnologiaRepository.findById(id);
    if (!tecnologia) {
      throw new Error("La tecnología no fue encontrada.");
    }
    return tecnologia;
  },

  async findByName(nombre) {
    const tecnologia = await TecnologiaRepository.findByName(nombre);
    if (!tecnologia) {
      throw new Error("La tecnología no fue encontrada.");
    }
    return tecnologia;
  },

  async findAllPaginated(page, limit) {
    const skip = (page - 1) * limit;
    return await TecnologiaRepository.findAllPaginated(skip, limit);
  },

  async update(id, data, file) {
    const tecnologiaExistente = await TecnologiaRepository.findById(id);
    if (!tecnologiaExistente) {
      throw new Error("La tecnología no fue encontrada.");
    }

    let nuevaImagenUrl = tecnologiaExistente.imagen.url;

    // Manejar la imagen: eliminar la antigua y subir la nueva
    if (file) {
      await eliminarArchivoAntiguo(tecnologiaExistente.imagen.url);
      nuevaImagenUrl = await subirArchivoAFirebase(file, "tecnologias");
    }

    // Actualizar la tecnología
    return await TecnologiaRepository.updateById(id, {
      ...data,
      imagen: { url: nuevaImagenUrl },
    });
  },

  async deactivate(id) {
    return await TecnologiaRepository.deactivateById(id);
  },
};
