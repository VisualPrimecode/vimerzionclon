import { subirArchivoAFirebase, eliminarArchivoAntiguo } from "../../utils/firebaseUtil.js";
import { GameRepository } from "../../repository/mongo/game.js";

export const GameService = {

  async create(data, files) {
    console.log("Inicio de método create");
    console.log("Datos recibidos:", data);
    console.log("Archivos recibidos:", files);
  
    const { nombre, descripcion, categoria, activo, plataformas, hashtags, valoracion } = data;
  
    console.log("Validando campos obligatorios...");
    if (!nombre || !descripcion || !categoria || !plataformas) {
      console.error("Faltan campos obligatorios:", { nombre, descripcion, categoria, plataformas });
      throw new Error("Faltan campos obligatorios.");
    }
  
    let plataformasArray;
    try {
      plataformasArray = JSON.parse(plataformas);
      console.log("Plataformas parseadas:", plataformasArray);
    } catch (err) {
      console.error("Error al parsear plataformas:", plataformas);
      throw new Error("El formato de plataformas no es válido.");
    }
  
    if (!Array.isArray(plataformasArray) || plataformasArray.length === 0) {
      console.error("Plataformas vacías o no es un array:", plataformasArray);
      throw new Error("Se debe incluir al menos una plataforma.");
    }
  
    const plataformasProcesadas = [];
  
    for (const plataforma of plataformasArray) {
      console.log(`Procesando plataforma: ${JSON.stringify(plataforma)}`);
  
      if (!plataforma.videoUrl) {
        console.error(`Falta videoUrl en plataforma: ${plataforma.nombre}`);
        throw new Error(`La plataforma ${plataforma.nombre} no tiene una URL de video.`);
      }
  
      const claveArchivo = `imagen_${plataforma.nombre.replace(/\s+/g, "_").toLowerCase()}`;
      const archivo = files[claveArchivo]?.[0];
      console.log(`Buscando archivo para ${plataforma.nombre}: clave "${claveArchivo}"`, archivo);
  
      let imagenUrl = null;
  
      if (archivo) {
        try {
          console.log(`Subiendo imagen para la plataforma ${plataforma.nombre}...`);
          imagenUrl = await subirArchivoAFirebase(archivo, "catalogo-juegos");
          console.log(`Imagen subida exitosamente: ${imagenUrl}`);
        } catch (error) {
          console.error(`Error subiendo imagen para ${plataforma.nombre}:`, error);
          throw new Error(`Error subiendo la imagen de la plataforma ${plataforma.nombre}`);
        }
      } else {
        console.warn(`No se encontró archivo para la plataforma: ${plataforma.nombre}`);
      }
  
      plataformasProcesadas.push({
        nombre: plataforma.nombre,
        imagenUrl: imagenUrl || "default-image-url",
        videoUrl: plataforma.videoUrl,
      });
    }
  
    console.log("Plataformas procesadas:", plataformasProcesadas);
  
    // Procesar hashtags
    let hashtagsArray = [];
    if (hashtags) {
      if (typeof hashtags === "string") {
        hashtagsArray = hashtags.split(',').map((tag) => tag.trim()).filter(Boolean);
      } else if (Array.isArray(hashtags)) {
        hashtagsArray = hashtags;
      }
    }
  
    // Procesar valoración
    let valoracionNumerica = 0;
    if (valoracion) {
      const parsed = parseFloat(valoracion);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 5) {
        valoracionNumerica = parsed;
      }
    }
  
    try {
      console.log("Creando juego en la base de datos...");
      const newGame = await GameRepository.create({
        nombre,
        descripcion,
        categoria,
        plataformas: plataformasProcesadas,
        activo: activo === "true",
        hashtags: hashtagsArray,
        valoracion: valoracionNumerica,
      });
      console.log("Juego creado exitosamente:", newGame);
      return newGame;
    } catch (error) {
      console.error("Error creando el juego en la base de datos:", error);
      throw new Error("No se pudo crear el juego.");
    }
  },
  
  

  async update(id, data, files) {
    const juegoExistente = await GameRepository.findById(id);
    if (!juegoExistente) {
      throw new Error("El juego no fue encontrado.");
    }
  
    const { nombre, descripcion, categoria, activo, plataformas, hashtags, valoracion } = data;
  
    if (nombre) juegoExistente.nombre = nombre;
    if (descripcion) juegoExistente.descripcion = descripcion;
    if (categoria) juegoExistente.categoria = categoria;
    if (activo !== undefined) juegoExistente.activo = activo === "true";
  
    // Procesar hashtags
    if (hashtags) {
      if (typeof hashtags === "string") {
        juegoExistente.hashtags = hashtags.split(',').map(tag => tag.trim()).filter(Boolean);
      } else if (Array.isArray(hashtags)) {
        juegoExistente.hashtags = hashtags;
      }
    }
  
    // Procesar valoración
    if (valoracion) {
      const parsedValoracion = parseFloat(valoracion);
      if (!isNaN(parsedValoracion) && parsedValoracion >= 0 && parsedValoracion <= 5) {
        juegoExistente.valoracion = parsedValoracion;
      }
    }
  
    // Resto del procesamiento de plataformas...
    const plataformasArray = plataformas ? JSON.parse(plataformas) : [];
    const plataformasActuales = juegoExistente.plataformas || [];
  
    const plataformasEliminadas = plataformasActuales.filter(
      (actual) => !plataformasArray.some((nueva) => nueva.nombre === actual.nombre)
    );
  
    for (const plataformaEliminada of plataformasEliminadas) {
      try {
        if (plataformaEliminada.imagenUrl) {
          await eliminarArchivoAntiguo(plataformaEliminada.imagenUrl);
        }
      } catch (error) {
        console.error(`Error eliminando la imagen de la plataforma ${plataformaEliminada.nombre}:`, error);
      }
    }
  
    const plataformasActualizadas = plataformasActuales.filter(
      (actual) => !plataformasEliminadas.some((eliminada) => eliminada.nombre === actual.nombre)
    );
  
    for (const plataforma of plataformasArray) {
      const claveArchivo = `imagen_${plataforma.nombre.replace(/\s+/g, "_").toLowerCase()}`;
      const archivo = files[claveArchivo]?.[0];
  
      const plataformaExistente = plataformasActualizadas.find(
        (p) => p.nombre === plataforma.nombre
      );
  
      try {
        if (archivo) {
          if (plataformaExistente) {
            await eliminarArchivoAntiguo(plataformaExistente.imagenUrl);
            plataformaExistente.imagenUrl = await subirArchivoAFirebase(archivo, "catalogo-juegos");
          } else {
            const nuevaImagenUrl = await subirArchivoAFirebase(archivo, "catalogo-juegos");
            plataformasActualizadas.push({ 
              nombre: plataforma.nombre, 
              imagenUrl: nuevaImagenUrl,
              videoUrl: plataforma.videoUrl,
            });
          }
        } else if (!plataformaExistente) {
          plataformasActualizadas.push({ 
            nombre: plataforma.nombre, 
            videoUrl: plataforma.videoUrl || '',
          });
        }
  
        if (plataformaExistente && plataforma.videoUrl) {
          plataformaExistente.videoUrl = plataforma.videoUrl;
        }
      } catch (error) {
        console.error(`Error procesando la plataforma ${plataforma.nombre}:`, error);
      }
    }
  
    juegoExistente.plataformas = plataformasActualizadas;
  
    return await GameRepository.updateById(id, juegoExistente);
  },
  
  
  async findById(id) {
    return await GameRepository.findById(id);
  },

  async findAllPaginated(page, limit, plataforma = null) {
    return await GameRepository.findAllPaginated(page, limit, plataforma);
},
 
  async deactivate(id) {
    return await GameRepository.deactivateById(id);
  },

  async findByPlatform(platform, page = 1, limit = 10) {
    if (!platform) {
      throw new Error("El parámetro 'platform' es obligatorio.");
    }
  
    // Llamar al repositorio para obtener los datos paginados
    return await GameRepository.findByPlatform(platform, page, limit);
  },
  async findCatalogData(page = 1, limit = 10, plataforma = null) {
    try {
      // Llama al método findCatalogData del repositorio/modelo
      return await GameRepository.findCatalogData(page, limit, plataforma);
    } catch (error) {
      console.error('Error en GameService.findCatalogData:', error);
      throw new Error('No se pudo cargar el catálogo de juegos.');
    }
  },
};
