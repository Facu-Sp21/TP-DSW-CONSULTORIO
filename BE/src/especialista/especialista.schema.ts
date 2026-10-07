import z from 'zod';

export const especialistaBodySchema = z.object({
  matricula: z.string().max(30).nonempty('La matrícula del especialista es obligatoria'),
  nombre: z.string().max(60).nonempty('El nombre del especialista es obligatorio'),
  email: z.string().max(120).email('El email del especialista no es válido'),
  telefono: z.string().max(30).nonempty('El teléfono del especialista es obligatorio'),
  cod_especialidad: z.coerce.number().int().positive(),
});

export const especialistaParamsSchema = z.object({
  cod_especialista: z.coerce.number().int().positive(),
});
