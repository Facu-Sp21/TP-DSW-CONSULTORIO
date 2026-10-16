import { horaAMinutos, minutosAHora } from './turno.availability.js';
// Todos los especialistas del consultorio trabajan de lunes a viernes de 08:00 a 17:00

export function esDiaLaboral(fecha: string): boolean {
  const [year, month, day] = fecha.split('-').map(Number);
  const diaSemana = new Date(year, month - 1, day).getDay();

  return diaSemana >= 1 && diaSemana <= 5; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
}

// Horario laboral (08:00 a 17:00)
export function esHorarioLaboral(horaString: string): boolean {// el argumento seria la hora de inicio del turno + la duracion del turno, para ver si se pasa de las 17:00
  const minutosTotales = horaAMinutos(horaString);
  const inicioJornada = 480; // 08:00 en minutos
  const finJornada = 1020;   // 17:00 en minutos

  // Validamos que el turno inicie adentro o justo en la jornada, 
  // y que no se pase de las 17:00.
  return minutosTotales >= inicioJornada && minutosTotales < finJornada;
}

export function esTurnoValido(fecha: string, hora_inicio: string, duracion: number): boolean {
  if (!esDiaLaboral(fecha) || !Number.isInteger(duracion) || duracion <= 0) {
    return false;
  }

  const inicioTurno = horaAMinutos(hora_inicio);
  const finTurno = inicioTurno + duracion;
  const inicioJornada = 8 * 60;
  const finJornada = 17 * 60;
  const estaAlineado = (inicioTurno - inicioJornada) % duracion === 0;

  return inicioTurno >= inicioJornada && estaAlineado && inicioTurno < finJornada && finTurno <= finJornada;
}
