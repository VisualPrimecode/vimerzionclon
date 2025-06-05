import mongoose from 'mongoose';

const desafioSchema = new mongoose.Schema({
  desafio: {
    type: String,
    required: true,
    index: true, // Índice para búsquedas rápidas
  },
  experiencia: {
    type: String,
    required: true,
  },
  valor: {
    type: String,
    required: true, // ejemplo: "1 punto"
  },
  premio: {
    type: String,
    required: true, // ejemplo: "2 gemas"
  },
  tiempoMaximo: {
    type: Number,
    required: true, // en minutos
  },
  intentos: {
    type: Number,
    required: true,
  },
  activo: {
    type: Boolean,
    default: true,
  },
});

// Aquí el nombre 'Desafio' es el nombre del modelo (en singular)
export const Desafio = mongoose.model('Desafio', desafioSchema);
