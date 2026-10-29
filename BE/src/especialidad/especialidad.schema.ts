import z from 'zod';

export const especialidadBodySchema = z.object({ 
  nombre: z.string().max(60).nonempty('El nombre de la especialidad es obligatorio'),
  duracion_minutos: z.coerce.number().int().positive().refine((val) => val % 5 === 0, {
    message: 'La duración en minutos debe ser un múltiplo de 5',
  }),
  estado: z.boolean().optional(),
});

export const especialidadParamsSchema = z.object({ 
  cod_especialidad: z.coerce.number().int().positive() 
});
