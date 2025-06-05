import { GameService } from "../services/mongo/game.js";

export const createCatalogoJuego = async (req, res) => {
  console.log("Datos recibidos para crear el juego:", req.body);
  
  try {
    const newGame = await GameService.create(req.body, req.files);

    res.status(201).json({
      success: true,
      message: "Juego creado exitosamente.",
      data: newGame
    });
  } catch (error) {
    console.error("Error creando juego:", error);

    // Personaliza el status si detectás un tipo de error específico
    let statusCode = 500;
    let message = "Error al crear el juego.";

    // Si usás errores personalizados (por ejemplo desde un servicio)
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = error.message;
    } else if (error.code === 'LIMIT_FILE_SIZE') {
      statusCode = 413; // Payload Too Large
      message = "El archivo es demasiado grande.";
    } else if (error.message.includes('Archivo requerido')) {
      statusCode = 400;
      message = error.message;
    }

    res.status(statusCode).json({
      success: false,
      message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


export const updateCatalogoJuego = async (req, res) => {
  try {
    
    const updatedGame = await GameService.update(req.params.id, req.body, req.files);
    res.status(200).json({ success: true, message: "Juego actualizado exitosamente.", data: updatedGame });
  } catch (error) {
    console.error("Error actualizando juego:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const findById = async (req, res) => {
  try {
    
    const game = await GameService.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({ success: false, message: "El juego no fue encontrado." });
    }
    return res.status(200).json({
      success: true,
      ...game, // Expande las propiedades del juego en la respuesta
    });
  } catch (error) {
    console.error("Error buscando juego:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deactivateCatalogoJuego = async (req, res) => {
  try {
    await GameService.deactivate(req.params.id);
    res.status(200).json({ success: true, message: "Juego desactivado exitosamente." });
  } catch (error) {
    console.error("Error desactivando juego:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const findAllPaginated = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1); // Mínimo 1
    const limit = Math.max(Number(req.query.limit) || 10, 1); // Mínimo 1
    const plataforma = req.query.plataforma || null;

    const response = await GameService.findAllPaginated(page, limit, plataforma);
    res.status(200).json({ success: true, ...response });
  } catch (error) {
    console.error("Error listando juegos:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const findByPlatform = async (req, res) => {
  try {
    const { platform } = req.params; // Obtener el parámetro 'platform' de la URL
    const page = Number(req.query.page) || 1; // Parámetro opcional para la página
    const limit = Number(req.query.limit) || 10; // Parámetro opcional para el límite de resultados por página

    // Llamar al servicio para buscar juegos por plataforma
    const response = await GameService.findByPlatform(platform, page, limit);

    res.status(200).json({
      success: true,
      ...response,
    });
  } catch (error) {
    console.error("Error listando juegos por plataforma:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al listar los juegos por plataforma.",
    });
  }
};


export const findCatalogData = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1); // Mínimo 1
    const limit = Math.max(Number(req.query.limit) || 10, 1); // Mínimo 1
    const platform = req.query.platform || null;

    // Llamar al servicio para obtener solo el nombre y la imagen
    const response = await GameService.findCatalogData(page, limit, platform);

    res.status(200).json({ 
      success: true, 
      ...response 
    });
  } catch (error) {
    console.error("Error obteniendo catálogo de juegos:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error al obtener el catálogo de juegos." 
    });
  }
};

