import z from 'zod';

export const atenderTurnoBodySchema = z.object({
  diagnostico: z.string().trim().min(3, 'El diagnóstico debe tener al menos 3 caracteres').max(2000),
  indicaciones: z.string().trim().max(2000).optional(),
});

export const historiaQuerySchema = z.object({
  nro_afiliado: z.coerce.number().int().positive('El número de afiliado es inválido'),
});