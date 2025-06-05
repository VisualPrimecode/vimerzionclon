import { z } from "zod";

export const CatalogoJuegoCreateDTO = z.object({
  nombre: z.string({
    required_error: "El nombre es obligatorio.",
  }),
  descripcion: z.string({
    required_error: "La descripción es obligatoria.",
  }),
  categoria: z.enum(['Aventura', 'RPG', 'Acción', 'Deportes', 'Simulación'], {
    required_error: "La categoría es obligatoria y debe ser válida.",
  }),
  plataformas: z.array(
    z.object({
      nombre: z.string({
        required_error: "El nombre de la plataforma es obligatorio.",
      }),
      imagenUrl: z.string({
        required_error: "La URL de la imagen de la plataforma es obligatoria.",
      }),
    })
  ).nonempty("Debe incluir al menos una plataforma."),
  activo: z.boolean({
    required_error: "El estado activo es obligatorio.",
  }),
});

// Función de validación para usar en el controlador o servicio
export const validateCatalogoJuegoCreateDTO = (data) => {
  try {
    return CatalogoJuegoCreateDTO.parse(data);
  } catch (error) {
    throw new Error(
      error.errors.map((err) => `${err.path.join('.')} - ${err.message}`).join(", ")
    );
  }
};
