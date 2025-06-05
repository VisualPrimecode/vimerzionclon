import { TecnologiaService } from "../services/mongo/tecnology.js";

export const createTecnologia = async (req, res) => {
  try {
    const tecnologia = await TecnologiaService.create(req.body, req.file);
    res.status(201).json({
      success: true,
      message: "Tecnología creada exitosamente.",
      data: tecnologia,
    });
  } catch (error) {
    console.error("Error en createTecnologia:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al crear la tecnología.",
    });
  }
};

export const updateTecnologia = async (req, res) => {
  try {
    const { id } = req.params;
    const tecnologiaActualizada = await TecnologiaService.update(id, req.body, req.file);
    res.status(200).json({
      success: true,
      message: "Tecnología actualizada exitosamente.",
      data: tecnologiaActualizada,
    });
  } catch (error) {
    console.error("Error en updateTecnologia:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al actualizar la tecnología.",
    });
  }
};

export const findByIdTecnologia = async (req, res) => {
  try {
    const { id } = req.params;
    const tecnologia = await TecnologiaService.findById(id);
    res.status(200).json({
      success: true,
      ...tecnologia
    });
  } catch (error) {
    console.error("Error en findByIdTecnologia:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al buscar la tecnología.",
    });
  }
};

export const findByNameTecnologia = async (req, res) => {
  try {
    const nombre = req.params.nombre

    
    const tecnologia = await TecnologiaService.findByName(nombre);
    res.status(200).json({
      success: true,
      ...tecnologia,
    });
  } catch (error) {
    console.error("Error en findByNameTecnologia:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al buscar la tecnología por nombre.",
    });
  }
};

export const findAllPaginatedTecnologia = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const response = await TecnologiaService.findAllPaginated(page, limit);
    res.status(200).json({
      success: true,
      ...response,
    });
  } catch (error) {
    console.error("Error en findAllPaginatedTecnologia:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al listar las tecnologías.",
    });
  }
};

export const deactivateTecnologia = async (req, res) => {
  try {
    const { id } = req.params;
    await TecnologiaService.deactivate(id);
    res.status(200).json({
      success: true,
      message: "Tecnología desactivada exitosamente.",
    });
  } catch (error) {
    console.error("Error en deactivateTecnologia:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al desactivar la tecnología.",
    });
  }
};
