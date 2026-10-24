import z from 'zod';

export const pacienteBodySchema = z.object({
  dni: z.string().max(20).min(1, 'El campo DNI del paciente es obligatorio'),
  nombre: z.string().max(60).min(1, 'El campo Nombre del paciente es obligatorio'),
  telefono: z.string().max(30).min(1, 'El campo Teléfono del paciente es obligatorio'),
  direccion: z.string().max(100).min(1, 'El campo Dirección del paciente es obligatorio'),
  email: z.string().max(120).email('El campo Email del paciente no es válido'),
  contrasena: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres').optional(),
  cod_os: z.coerce.number().int().positive().nullable().optional(),
});

export const pacienteUpdateBodySchema = z.object({
  nombre: z.string().max(60).min(1, 'El campo Nombre del paciente es obligatorio').optional(),
  dni: z.string().max(20).min(1, 'El campo DNI del paciente es obligatorio').optional(),
  email: z.string().max(120).email('El campo Email del paciente no es válido').optional(),
  telefono: z.string().max(30).min(1, 'El campo Teléfono del paciente es obligatorio').optional(),
  direccion: z.string().max(100).min(1, 'El campo Dirección del paciente es obligatorio').optional(),
  contrasena: z
    .union([
      z.string().min(4, 'La contraseña debe tener al menos 4 caracteres').max(100),
      z.literal(''),
    ])
    .optional(),
  cod_os: z.coerce.number().int().positive().nullable().optional(),
});

export const pacienteParamsSchema = z.object({
  nro_afiliado: z.coerce.number().int().positive(),
});