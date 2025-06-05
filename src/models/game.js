import mongoose from 'mongoose';

// Definir los valores permitidos para las categorías (enum)
const categoriasEnum = ['Aventura', 'RPG', 'Acción', 'Deportes', 'Simulación','Sand Box','Shutter',
  'Carreras'
];

const gameSchema = new mongoose.Schema({
  nombre: { type: String, required: true, index: true },
  descripcion: { type: String, required: true },
  plataformas: [
    {
      nombre: { type: String, required: true },
      imagenUrl: { type: String, required: true },
      videoUrl: { type: String, required: true },
    },
  ],
  categoria: {
    type: String,
    enum: categoriasEnum,
    required: true,
  },
  activo: {
    type: Boolean,
    default: true,
  },

  // NUEVOS CAMPOS
  hashtags: {
    type: [String],
    default: [],
  },
  valoracion: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  }
});


// Índices adicionales para optimizar búsquedas
gameSchema.index({ categoria: 1 });
gameSchema.index({ 'plataformas.nombre': 1 });

export const Game = mongoose.model('Game', gameSchema);
