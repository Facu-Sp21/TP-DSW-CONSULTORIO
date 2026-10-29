import z from 'zod';


export const afiliadoBodySchema = z.object({
  nombreCompleto: z.string().max(100).nonempty('El nombre completo es obligatorio'),
  dni: z.string().min(7).max(10).nonempty('El DNI es obligatorio'),
  email: z.string().email('El formato del email no es válido').nonempty('El email es obligatorio'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  obraSocialId: z.coerce.number().int().positive().optional()
});


export const afiliadoParamsSchema = z.object({
  id: z.coerce.number().int().positive() // Transforma el string de la URL a número entero positivo
});