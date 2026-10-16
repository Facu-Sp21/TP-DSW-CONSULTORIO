import { BadRequestError } from '../shared/errorsModel.js';
import { esDiaLaboral } from './turno.calendar.js';
import { horaAMinutos, minutosAHora } from './turno.availability.js';

export const HORA_APERTURA_MINUTOS = 8 * 60;
export const HORA_CIERRE_MINUTOS = 17 * 60;

const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const FORMATO_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

function inicioDelDia(fecha: Date): Date {
  const inicio = new Date(fecha);
  inicio.setHours(0, 0, 0, 0);
  return inicio;
}

function fechaLocal(fecha: string): Date | undefined {
  if (!FORMATO_FECHA.test(fecha)) {
    return undefined;
  }

  const [anio, mes, dia] = fecha.split('-').map(Number);
  const fechaConvertida = new Date(anio, mes - 1, dia);

  if (
    fechaConvertida.getFullYear() !== anio ||
    fechaConvertida.getMonth() !== mes - 1 ||
    fechaConvertida.getDate() !== dia
  ) {
    return undefined;
  }

  return fechaConvertida;
}

export function esFechaReservable(fecha: string, ahora = new Date()): boolean {
  const fechaTurno = fechaLocal(fecha);
  if (!fechaTurno) {
    return false;
  }

  const hoy = inicioDelDia(ahora);
  const limite = new Date(hoy);
  limite.setMonth(limite.getMonth() + 6);
  return fechaTurno >= hoy && fechaTurno <= limite && esDiaLaboral(fecha);
}

export function validarHorarioTurno(
  fecha: string,
  hora_inicio: string,
  duracion_minutos: number,
  ahora = new Date(),
): void {
  if (!esFechaReservable(fecha, ahora)) {
    throw new BadRequestError(
      'Los turnos solo pueden reservarse de lunes a viernes, sin feriados, desde hoy y hasta seis meses en el futuro',
    );
  }

  if (!Number.isInteger(duracion_minutos) || duracion_minutos <= 0) {
    throw new BadRequestError('La duración de la consulta debe ser un número entero positivo');
  }

  if (!FORMATO_HORA.test(hora_inicio)) {
    throw new BadRequestError('La hora del turno debe tener formato HH:mm');
  }

  const minutos = horaAMinutos(hora_inicio);
  const estaAlineado = (minutos - HORA_APERTURA_MINUTOS) % duracion_minutos === 0;
  const terminaEnHorario = minutos + duracion_minutos <= HORA_CIERRE_MINUTOS;

  if (minutos < HORA_APERTURA_MINUTOS || !estaAlineado || !terminaEnHorario) {
    throw new BadRequestError(
      'El horario debe coincidir con la duración de la consulta y estar dentro de la atención de 08:00 a 17:00',
    );
  }
}

export function generarHorariosDelDia(fecha: string, duracion_minutos: number): string[] {
  if (!esFechaReservable(fecha) || !Number.isInteger(duracion_minutos) || duracion_minutos <= 0) {
    return [];
  }

  const horarios: string[] = [];
  for (
    let minutos = HORA_APERTURA_MINUTOS;
    minutos + duracion_minutos <= HORA_CIERRE_MINUTOS;
    minutos += duracion_minutos
  ) {
    horarios.push(minutosAHora(minutos));
  }
  return horarios;
}

export function esMismaFecha(a: string, b: string): boolean {
  const fechaA = fechaLocal(a);
  const fechaB = fechaLocal(b);

  return fechaA !== undefined && fechaB !== undefined && fechaA.getTime() === fechaB.getTime();
}
