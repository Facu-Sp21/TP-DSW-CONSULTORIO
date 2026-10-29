import z from 'zod';


export const obraSocialBodySchema = z.object({
  nombre: z.string().max(60).nonempty('El nombre de la obra social es obligatorio')
});


export const obraSocialParamsSchema = z.object({
  cod_os: z.coerce.number().int().positive() 
});