import { z } from 'zod';

// Esquema base sin el discriminador
const BaseUserSchema = z.object({
  username: z.string().min(3, 'Username mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Password mínimo 8 caracteres'), // Cambiado de hashed_password a password
});

// Esquema para CLIENTE
const ClienteSchema = BaseUserSchema.extend({
  nombreRol: z.literal('CLIENTE'), // Discriminador explícito
});

// Esquema para ADMINISTRADOR
const AdminSchema = BaseUserSchema.extend({
  nombreRol: z.literal('ADMINISTRADOR'), // Discriminador explícito
});

// Unión discriminada basada en `nombreRol`
const UserSchema = z.discriminatedUnion('nombreRol', [AdminSchema, ClienteSchema]);

export { UserSchema };
