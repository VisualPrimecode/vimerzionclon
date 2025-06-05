import mongoose from 'mongoose';

const tecnologiaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    index: true, // Índice para mejorar las búsquedas
  },
  descripcion: {
    type: String,
    required: true,
  },
  imagen: {
      url: { type: String, required: true }, // URL de la imagen
      
  },
  activo: {
    type: Boolean,
    default: true,
  },
});


export const Tecnologia = mongoose.model('Tecnology', tecnologiaSchema);
