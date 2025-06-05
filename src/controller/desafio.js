import { DesafioService } from "../services/mongo/desafio.js";

export const createDesafio = async (req, res) => {
  try {
    const desafio = await DesafioService.create(req.body, req.file);
    res.status(201).json({
      success: true,
      message: "Desafío creado exitosamente.",
      data: desafio,
    });
  } catch (error) {
    console.error("Error en createDesafio:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al crear el desafío.",
    });
  }
};

export const updateDesafio = async (req, res) => {
  try {
    const { id } = req.params;
    const desafioActualizado = await DesafioService.update(id, req.body, req.file);
    res.status(200).json({
      success: true,
      message: "Desafío actualizado exitosamente.",
      data: desafioActualizado,
    });
  } catch (error) {
    console.error("Error en updateDesafio:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al actualizar el desafío.",
    });
  }
};

export const findByIdDesafio = async (req, res) => {
  try {
    const { id } = req.params;
    const desafio = await DesafioService.findById(id);
    res.status(200).json({
      success: true,
      ...desafio
    });
  } catch (error) {
    console.error("Error en findByIdDesafio:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al buscar el desafío.",
    });
  }
};

export const findByNameDesafio = async (req, res) => {
  try {
    const desafio = req.params.desafio;

    const desafioEncontrado = await DesafioService.findByName(desafio);
    res.status(200).json({
      success: true,
      ...desafioEncontrado,
    });
  } catch (error) {
    console.error("Error en findByNameDesafio:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al buscar el desafío por nombre.",
    });
  }
};

export const findAllPaginatedDesafio = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const response = await DesafioService.findAllPaginated(page, limit);
    res.status(200).json({
      success: true,
      ...response,
    });
  } catch (error) {
    console.error("Error en findAllPaginatedDesafio:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al listar los desafíos.",
    });
  }
};

export const deactivateDesafio = async (req, res) => {
  try {
    const { id } = req.params;
    await DesafioService.deactivate(id);
    res.status(200).json({
      success: true,
      message: "Desafío desactivado exitosamente.",
    });
  } catch (error) {
    console.error("Error en deactivateDesafio:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al desactivar el desafío.",
    });
  }
};
