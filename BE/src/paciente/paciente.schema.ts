import z from 'zod';

export const pacienteBodySchema = z.object({
  dni: z.string().max(20).nonempty('El DNI del paciente es obligatorio'),
  nombre: z.string().max(60).nonempty('El nombre del paciente es obligatorio'),
  telefono: z.string().max(30).nonempty('El teléfono del paciente es obligatorio'),
  direccion: z.string().max(100).nonempty('La dirección del paciente es obligatoria'),
  email: z.string().max(120).email('El email del paciente no es válido'),
  contrasena: z.string().max(100).nonempty('La contraseña del paciente es obligatoria'),
  cod_os: z.coerce.number().int().positive().optional(),
});

export const pacienteParamsSchema = z.object({
  nro_afiliado: z.coerce.number().int().positive(), // coerce convierte el valor a numero ya que viene como string del req.params
});
