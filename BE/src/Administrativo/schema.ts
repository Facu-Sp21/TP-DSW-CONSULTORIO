import z from 'zod';

export const administrativoBodySchema = z.object({
  nombreCompleto: z.string().max(100).nonempty('El nombre completo es obligatorio'),
  legajo: z.string().min(3).max(10).nonempty('El legajo es obligatorio'),
  email: z.string().email('El formato del email no es válido').nonempty('El email es obligatorio'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional()
});

export const administrativoParamsSchema = z.object({
  id: z.coerce.number().int().positive()
});