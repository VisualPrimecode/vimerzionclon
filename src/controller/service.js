import { ServicioService } from "../services/mongo/service.js";

export const createServicio = async (req, res) => {
  try {
    
    // Crear un nuevo servicio
    const servicio = await ServicioService.create(req.body, req.files);
    res.status(201).json({
      success: true,
      message: "Servicio creado exitosamente.",
      data: servicio,
    });
  } catch (error) {
    console.error("Error en createServicio:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al crear el servicio.",
    });
  }
};

export const updateServicio = async (req, res) => {
  try {
    const { id } = req.params;

    // Actualizar el servicio existente
    const servicioActualizado = await ServicioService.update(id, req.body, req.files);
    res.status(200).json({
      success: true,
      message: "Servicio actualizado exitosamente.",
      data: servicioActualizado,
    });
  } catch (error) {
    console.error("Error en updateServicio:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al actualizar el servicio.",
    });
  }
};

export const findByIdServicio = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Llamar al servicio para buscar el servicio por ID
    const servicio = await ServicioService.findById(id);

    // Si no se encuentra el servicio
    if (!servicio) {
      return res.status(404).json({
        success: false,
        message: "El servicio no fue encontrado.",
      });
    }

    // Responder con las propiedades del servicio directamente (sin envolver en `data`)
    res.status(200).json({
      success: true,
      ...servicio, // Desestructurar el servicio directamente
    });
  } catch (error) {
    console.error("Error en findByIdServicio:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al buscar el servicio.",
    });
  }
};


export const findByNameServicio = async (req, res) => {
  try {
    const titulo = req.params.titulo

    
    // Buscar un servicio por su nombre
    const servicio = await ServicioService.findByTitle(titulo);

    if (!servicio) {
      return res.status(404).json({
        success: false,
        message: "El servicio no fue encontrado por nombre.",
      });
    }

    res.status(200).json({
      success: true,
      ...servicio,
    });
  } catch (error) {
    console.error("Error en findByNameServicio:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al buscar el servicio por nombre.",
    });
  }
};

export const findAllPaginatedServicio = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Obtener todos los servicios con paginación
    const response = await ServicioService.findAllPaginated(page, limit);
    res.status(200).json({
      success: true,
      ...response,
    });
  } catch (error) {
    console.error("Error en findAllPaginatedServicio:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al listar los servicios.",
    });
  }
};

export const deactivateServicio = async (req, res) => {
  try {
    const { id } = req.params;

    // Desactivar un servicio
    const servicioDesactivado = await ServicioService.deactivate(id);

    if (!servicioDesactivado) {
      return res.status(404).json({
        success: false,
        message: "El servicio no fue encontrado.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Servicio desactivado exitosamente.",
    });
  } catch (error) {
    console.error("Error en deactivateServicio:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al desactivar el servicio.",
    });
  }
};
