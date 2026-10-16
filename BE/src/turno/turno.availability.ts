// Convierte string 'HH:mm' a minutos. Ej: '01:30' -> 90.
export function horaAMinutos(horaString: string): number {
  const [horas, minutos] = horaString.split(':').map(Number);
  return horas * 60 + minutos;
}

// Convierte minutos a string 'HH:mm'. Ej: 90 -> '01:30'.
export function minutosAHora(totalMinutos: number): string {
  const horas = Math.floor(totalMinutos / 60).toString().padStart(2, '0'); // convierto a string y le agrego un 0 a la izquierda si es necesario
  const minutos = (totalMinutos % 60).toString().padStart(2, '0'); // el % solo me da los minutos que no llegan a cubrir una hora, convierto a string y le agrego un 0 a la izquierda si es necesario
  return `${horas}:${minutos}`;
}

// Genera un array de slots de tiempo entre horaInicio y horaFin, con la duración especificada.
export function generarSlots(horaInicio: string, horaFin: string, duracion: number): string[] { // para no dificultad demasiado el desarrollo, que todos tienen la misma hora de inicio y fin
  const slots: string[] = [];
  let minActual = horaAMinutos(horaInicio); // '08:00' -> 480
  const minFin = horaAMinutos(horaFin); // '17:00' -> 1020

  while (minActual < minFin) {
    slots.push(minutosAHora(minActual)); // '08:00', '08:15', '08:30', ... si la duración es 15 minutos
    minActual += duracion;
  }
  return slots; // ['08:00', '08:15', '08:30', ...] esto es lo que va a mostrar el front
}

// Recibe los tiempos expresados en minutos absolutos (ej: 1020).
export function chocaEnMinutos(inicioA: number, finA: number, inicioB: number, finB: number): boolean { // Ej: A = [08:00, 08:15], B = [08:10, 08:25] -> true
  // Un turno choca si empieza ANTES de que termine el otro Y termina DESPUÉS de que empiece el otro
  return inicioA < finB && inicioB < finA;
}