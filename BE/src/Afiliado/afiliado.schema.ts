import z from 'zod';


export const afiliadoBodySchema = z.object({
  nombreCompleto: z.string().max(60).nonempty('El nombre completo es obligatorio'),
  dni: z.string().min(7).max(10).nonempty('El DNI es obligatorio'),
  email: z.string().email('El formato del email no es válido').nonempty('El email es obligatorio'),
  contrasenia: z.string().min(6).max(60).nonempty('La contraseña es obligatoria'),
  cod_os: z.coerce.number().int().positive().optional()
});


export const afiliadoParamsSchema = z.object({
  cod_afiliado: z.coerce.number().int().positive() // Transforma el string de la URL a número entero positivo
});