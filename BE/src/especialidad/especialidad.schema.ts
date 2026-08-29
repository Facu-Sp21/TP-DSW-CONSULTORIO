import z from 'zod';

export const especialidadBodySchema = z.object({  //este schema se va a usar para validar el body de las peticiones POST y PUT
  nombre: z.string().max(60).nonempty('El nombre de la especialidad es obligatorio'),
});

export const especialidadParamsSchema = z.object({  //creo un schema solo para validar el parametro
  cod_especialidad: z.coerce.number().int().positive()  //coerce convierte el parametro que viene como string a numero
});
