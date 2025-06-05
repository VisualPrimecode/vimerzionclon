import { z } from 'zod';

// Esquema Zod para validar AuthRequest
const AuthRequestSchema = z.object({
  email: z
    .string()
    .email('Debe ser un email válido')
    .max(100, 'El email no puede exceder los 100 caracteres'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255, 'La contraseña no puede exceder los 255 caracteres'),
});

// Esquema Zod para validar AuthResponse
const AuthResponseSchema = z.object({
  message: z.string().min(1, 'El mensaje de respuesta es obligatorio'),
  status: z.number().int().default(200), // Código de estado HTTP (por defecto 200)
});

// Clase AuthRequest usando Zod
export class AuthRequest {
  constructor(email, password) {
    // Validar los datos con Zod
    const validatedData = AuthRequestSchema.parse({ email, password });

    // Asignar valores validados
    this.email = validatedData.email.trim().toLowerCase(); // Normalizar email
    this.password = validatedData.password;

    Object.freeze(this); // Hacer el objeto inmutable
  }
}

// Clase AuthResponse usando Zod
export class AuthResponse {
  constructor(message, status = 200) {
    // Validar los datos con Zod
    const validatedData = AuthResponseSchema.parse({ message, status });

    // Asignar valores validados
    this.message = validatedData.message;
    this.status = validatedData.status;

    Object.freeze(this); // Hacer el objeto inmutable
  }
}
