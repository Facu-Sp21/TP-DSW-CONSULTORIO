import z from 'zod';

export const especialistaBodySchema = z.object({
  matricula: z.string().max(30).min(1, 'La matrícula es obligatoria'),
  nombre: z.string().max(60).min(1, 'El nombre es obligatorio'),
  email: z.string().max(120).email('El email no es válido'),
  telefono: z.string().max(30).min(1, 'El teléfono es obligatorio'),
  contrasena: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres').optional(),
  cod_especialidad: z.coerce.number().int().positive().nullable().optional(),
});

export const especialistaParamsSchema = z.object({
  cod_especialista: z.coerce.number().int().positive(),
});