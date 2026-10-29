import z from 'zod';

export const especialistaBodySchema = z.object({
  dni: z.string().max(20).min(1, 'El DNI es obligatorio'),
  matricula: z.string().max(30).min(1, 'La matrícula es obligatoria'),
  nombre: z.string().max(60).min(1, 'El nombre es obligatorio'),
  email: z.string().max(120).email('El email no es válido').optional().or(z.literal('')),
  telefono: z.string().max(30).min(1, 'El teléfono es obligatorio'),
  contrasena: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres').optional().or(z.literal('')),
  cod_especialidad: z.coerce.number().int().positive().nullable().optional(),
  estado: z.boolean().optional(),
  consulta_particular: z.coerce.number().finite().nonnegative().optional(),
  obras_sociales: z.array(z.coerce.number().int().positive()).optional(),
});

export const especialistaParamsSchema = z.object({
  cod_especialista: z.coerce.number().int().positive(),
});