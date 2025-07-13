import { Game } from "../../models/game.js";

export const GameRepository = {
  async create(gameData) {
    return await Game.create(gameData);
  },

  async findById(id) {
    return await Game.findById(id).lean();
  },
  
  async findAllPaginated(page = 1, limit = 10, plataforma = null) {
    console.log("🔍 Parámetros recibidos:", { page, limit, plataforma });
  
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);
    const skip = (page - 1) * limit;
    console.log("📊 Parámetros ajustados:", { page, limit, skip });
  
    const matchQuery = plataforma ? { "plataformas.nombre": plataforma } : {};
    console.log("🔎 Filtro de búsqueda (matchQuery):", matchQuery);
  
    const pipeline = [
      { $match: matchQuery },
      { $unwind: "$plataformas" },
      {
        $group: {
          _id: "$_id",
          nombre: { $first: "$nombre" },
          descripcion: { $first: "$descripcion" },
          hashtags: { $first: "$hashtags" },
          valoracion: { $first: "$valoracion" },
          plataforma: { $first: "$plataformas" },
          categoria: { $first: "$categoria" } // ✅ Se vuelve a incluir
        }
      },
      { $sort: { nombre: 1 } },
      { $skip: skip },
      { $limit: limit },
    ];
    console.log("📦 Pipeline de agregación principal:", JSON.stringify(pipeline, null, 2));
  
    const totalPipeline = [
      { $match: matchQuery },
      { $group: { _id: "$_id" } },
      { $count: "total" },
    ];
    console.log("📦 Pipeline de agregación total:", JSON.stringify(totalPipeline, null, 2));
  
    const [games, totalResult] = await Promise.all([
      Game.aggregate(pipeline),
      Game.aggregate(totalPipeline),
    ]);
  
    console.log("✅ Resultados obtenidos:");
    console.log("🎮 Games:", games);
    console.log("📈 Total result:", totalResult);
  
    const total = totalResult.length > 0 ? totalResult[0].total : 0;
  
    const result = {
      games: games.map((game) => ({
        id: game._id,
        nombre: game.nombre,
        descripcion: game.descripcion,
        hashtags: game.hashtags || [],
        valoracion: game.valoracion || 0,
        plataforma: {
          nombre: game.plataforma.nombre,
          imagenUrl: game.plataforma.imagenUrl,
          videoUrl: game.plataforma.videoUrl
        },
        categoria: game.categoria || 'Sin categoría' // ✅ Se vuelve a incluir en el resultado
      })),
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  
    console.log("📤 Resultado final devuelto:", result);
  
    return result;
  },
  

  async findCatalogData(page = 1, limit = 10, plataforma = null) {
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);
    const skip = (page - 1) * limit;
  
    let pipeline;
    
    if (plataforma) {
        // Si se especifica plataforma, traer solo esa plataforma específica
        pipeline = [
            { $match: { "plataformas.nombre": plataforma } },
            { $unwind: "$plataformas" },
            { $match: { "plataformas.nombre": plataforma } }, // Filtrar solo la plataforma especificada
            {
              $group: {
                _id: "$_id",
                nombre: { $first: "$nombre" },
                descripcion: { $first: "$descripcion" },
                hashtags: { $first: "$hashtags" },         // ← Añadido
                valoracion: { $first: "$valoracion" },     // ← Añadido
                plataforma: { $first: "$plataformas" },
                categoria: { $first: "$categoria" } // 👈 vuelve a incluirlo aquí

              }
            }
        ];
    } else {
        // Si no se especifica plataforma, traer la primera plataforma de cada juego
        pipeline = [
            { $unwind: "$plataformas" },
            {
              $group: {
                _id: "$_id",
                nombre: { $first: "$nombre" },
                descripcion: { $first: "$descripcion" },
                hashtags: { $first: "$hashtags" },         // ← Añadido
                valoracion: { $first: "$valoracion" },     // ← Añadido
                plataforma: { $first: "$plataformas" },
                categoria: { $first: "$categoria" } // 👈 vuelve a incluirlo aquí

              }
            }
        ];
    }
    
    // Agregar las etapas comunes al pipeline
    pipeline.push(
        { $sort: { nombre: 1 } },
        { $skip: skip },
        { $limit: limit }
    );

    // Pipeline para contar el total
    const totalPipeline = [
        plataforma ? { $match: { "plataformas.nombre": plataforma } } : {},
        { $group: { _id: "$_id" } },
        { $count: "total" }
    ].filter(stage => Object.keys(stage).length > 0); // Eliminar etapas vacías

    // Ejecutar ambas consultas en paralelo
    const [games, totalResult] = await Promise.all([
        Game.aggregate(pipeline),
        Game.aggregate(totalPipeline),
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    // Formatear la respuesta
    return {
      games: games.map((game) => ({
          id: game._id,
          nombre: game.nombre,
          descripcion: game.descripcion,
          hashtags: game.hashtags || [], // ← asegurate que venga como array
          valoracion: game.valoracion || 0,
          plataforma: {
              nombre: game.plataforma.nombre,
              imagenUrl: game.plataforma.imagenUrl,
              videoUrl: game.plataforma.videoUrl
          }
      })),    
        total,
        page,
        pages: Math.ceil(total / limit)
    };
},
  

  async updateById(id, updateData) {
    return await Game.findByIdAndUpdate(
        id,
        { $set: updateData }, // Actualiza solo las propiedades especificadas
        { new: true }         // Devuelve el documento actualizado
    );
},


  async deactivateById(id) {
    return await Game.findByIdAndUpdate(id, { activo: false }, { new: true });
  },

  async findByPlatform(platform, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [games, total] = await Promise.all([
        Game.find({
            plataformas: {
                $elemMatch: {
                    nombre: platform.toLowerCase()
                }
            }
        })
            .select("nombre plataformas") // Solo seleccionamos lo necesario
            .skip(skip)
            .limit(limit)
            .lean(), // Convierte los documentos de mongoose a objetos JavaScript puros
        Game.countDocuments({
            plataformas: {
                $elemMatch: {
                    nombre: platform.toLowerCase()
                }
            }
        })
    ]);

    // Extraer imagenUrl de la plataforma correspondiente
    const gamesWithImages = games.map((game) => {
        const platformData = game.plataformas.find(
            (p) => p.nombre === platform.toLowerCase()
        );
        return {
            nombre: game.nombre,
            imagen: platformData?.imagenUrl || null, // Asignar null si no se encuentra
        };
    });

    return {
        success: true,
        games: gamesWithImages,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
    };
},
};
