import { z } from 'zod';

export const CategoriaCreateDTO = z.object({
    titulo: z
        .string()
        .min(1, { message: 'El título es obligatorio.' })
        .max(100, { message: 'El título no puede tener más de 100 caracteres.' }),
    descripcion: z
        .string()
        .min(1, { message: 'La descripción es obligatoria.' })
        .max(500, { message: 'La descripción no puede tener más de 500 caracteres.' })
});
