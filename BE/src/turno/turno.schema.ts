import z from 'zod';

const regexFecha = /^\d{4}-\d{2}-\d{2}$/; // Validación de Formato YYYY-MM-DD
const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/; // Validación de Formato HH:mm (24 horas)

// Validación de Calendario (Ej: Que no exista el 30 de febrero)
function esFechaValida(fecha: string): boolean {
  if (!regexFecha.test(fecha)) return false;

  const [year, month, day] = fecha.split('-').map(Number);

  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

// Validación de que la fecha y hora sean futuras (no se pueden reservar turnos para el pasado)
function esFechaHoraFuturaValida(fecha: string, hora_inicio: string): boolean {
  if (!esFechaValida(fecha) || !regexHora.test(hora_inicio)) return false;

  const [year, month, day] = fecha.split('-').map(Number);
  const [hour, minute] = hora_inicio.split(':').map(Number);
  
  // Construimos el turno en milisegundos
  const turnoMilisegundos = new Date(year, month - 1, day, hour, minute).getTime();
  
  // Obtenemos los milisegundos del momento exacto actual
  const ahoraMilisegundos = Date.now();

  // El turno debe ser estrictamente mayor al momento actual
  return turnoMilisegundos > ahoraMilisegundos;
}

export const turnoBodySchema = z.object({
  fecha: z
    .string()
    .regex(regexFecha, 'La fecha debe tener formato YYYY-MM-DD')
    .refine(esFechaValida, 'La fecha ingresada no es válida en el calendario'),
  hora_inicio: z
    .string()
    .regex(regexHora, 'La hora debe tener formato HH:mm (ej: 17:00)'),
  nro_afiliado: z.coerce.number().int().positive('El número de afiliado es inválido'),
  cod_especialista: z.coerce.number().int().positive('El código de especialista es inválido'),
}).superRefine((data, ctx) => { // data contiene los valores de fecha y hora_inicio, ctx es el contexto de validación
  // Usamos superRefine porque necesitamos evaluar la fecha y la hora en conjunto
  if (!esFechaHoraFuturaValida(data.fecha, data.hora_inicio)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['hora_inicio'],
      message: 'No se pueden reservar turnos en fechas u horarios pasados',
    });
  }
});

export const turnoQuerySchema = z.object({
  nro_afiliado: z.coerce.number().int().positive().optional(),
  cod_especialista: z.coerce.number().int().positive().optional(),
  fecha: z
    .string()
    .regex(regexFecha, 'La fecha debe tener formato YYYY-MM-DD')
    .refine(esFechaValida, 'La fecha ingresada no es válida en el calendario')
    .optional(),
}); 

export const disponibilidadQuerySchema = z.object({
  cod_especialista: z.coerce.number().int().positive('El código de especialista es requerido'),
  fecha: z
    .string()
    .regex(regexFecha, 'La fecha debe tener formato YYYY-MM-DD')
    .refine(esFechaValida, 'La fecha ingresada no es válida en el calendario'),
}); 

export const turnoParamsSchema = z.object({
  cod_turno: z.coerce.number().int().positive('El código de turno es inválido'),
});