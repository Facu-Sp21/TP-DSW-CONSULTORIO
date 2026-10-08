export type EstadoTurno = 'PENDIENTE' | 'ATENDIDO' | 'AUSENTE';

/** Fecha de hoy como 'YYYY-MM-DD' */
export function fechaDeHoy(ahora = new Date()): string {
  const mm = String(ahora.getMonth() + 1).padStart(2, '0');
  const dd = String(ahora.getDate()).padStart(2, '0');
  return `${ahora.getFullYear()}-${mm}-${dd}`;
}

export function motivoQueImpideCerrar(estado: EstadoTurno, fecha: string, hoy = fechaDeHoy()): string | undefined {
  if (estado !== 'PENDIENTE') {
    return 'Este turno ya fue atendido o marcado como ausente';
  }
  if (fecha > hoy) {
    return 'No se puede atender un turno de una fecha futura';
  }
  return undefined;
}