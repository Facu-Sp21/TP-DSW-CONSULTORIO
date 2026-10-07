import z from 'zod';
export const turnoBodySchema= z.object({
fecha:   z.iso.date(), //hay que validar que la fecha sea mayor o igual a hoy
hora: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'El formato de la hora debe ser HH:mm'),
cod_afiliado: z.coerce.number().int().positive(),
cod_especialista: z.coerce.number().int().positive()
});

export const turnoParamsSchema = z.object({
  cod_turno: z.coerce.number().int().positive() // Transforma el string de la URL a número entero positivo
});