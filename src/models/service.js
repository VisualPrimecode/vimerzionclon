import mongoose from 'mongoose';

const servicioSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  fotos: [
    {
      titulo:{ type: String, required: true },
      url: { type: String, required: true }, // URL de la imagen
      descripcion_foto:{type:String,required:true}
    },
  ],
  activo: {
    type: Boolean,
    default: true,
  },
});

// Crear un índice para búsquedas rápidas
servicioSchema.index({ titulo: 1 });

export const Servicio = mongoose.model('Service', servicioSchema);
