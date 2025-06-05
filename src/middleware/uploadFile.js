import multer from "multer";

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage();

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Aceptar solo archivos de imagen
  } else {
    cb(new Error("Solo se permiten archivos de imagen"), false);
  }
};

// Configuración general de Multer
export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Máximo 5MB por archivo
  fileFilter,
});

// Middleware para aceptar los nombres específicos de las plataformas
export const uploadFotosPlataformas = upload.fields([
  { name: "imagen_playstation_5", maxCount: 1 },
  { name: "imagen_playstation_vr", maxCount: 1 },
  { name: "imagen_nintendo_switch", maxCount: 1 },
  {name:"imagen_meta_quest_2", maxCount:1},
  { name: "imagen_meta_quest_3", maxCount: 1 }, 
  {name:"imagen_simuladores_psvr_2", maxCount:1},
  {name:"imagen_1_jugador", maxCount:1},
  {name:"imagen_2_jugador", maxCount:1},
  {name:"imagen_3_jugador", maxCount:1},
  {name:"imagen_4_jugador", maxCount:1},
  {name:"imagen_simuladores", maxCount:1},
]);

export const uploadFotoTecnologia = upload.single('imagen');
export const uploadFotosServicios = upload.array('imagen',9);
export const uploadFotoPaqute = upload.single('foto');